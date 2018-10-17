var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var exphbs  = require('express-handlebars');
var sassMiddleware = require('node-sass-middleware');
var browserify = require('browserify-middleware');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

// This is where all of our routes are living
var router = require('./router/index');
var db = require('./database');
var app = express();

// We are setting up our handlebars templating engine here:
var hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout', // the default layout of our page (located in views/layouts/layout)
  // Specify helpers which can be used in handlebar templates
  helpers: {
      foo: function () { return 'foo'; },
      bar: function () { return 'bar'; }
  }
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // hbs is the file extension we use

// Set up SaSS middleware - complies sass for us and moves it to a different directory
app.use (
   sassMiddleware({
     src: __dirname + '/client/sass/',
     dest: __dirname + '/client/',
     debug: true,
   })
 );

// browser sync (refreshes browser automatically in dev environment)
if(app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["client/**/*.{js,css}", "client/**/*.{js,scss}", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 4000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

// initialize express-session to allow us track the logged-in user across sessions
app.use(session({
    key: 'user_sid',
    secret: 'big_fat_random_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies && req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// Not sure how necessary this block really is honestly for the scope of this app
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we are setting up routes for all of our external stuff we wish to include
// It's nice because in the HTML we can simply link to '/bootstrap', but here we can route that to within the node modules folder if needs be
// first parameter is the mount point, second is the location in the file system
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/img", express.static(__dirname + "/client/img"));
app.use("/css", express.static(__dirname + "/client/css"));

// see the index.js file within /router folder to see what's going on here
router(app, db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Here we set up our database, and afterward, start the app :)
db.sequelize.sync(/*{ force: true }*/) // force true causes the tables to be dropped and reinserted
  .then(() => {
    app.listen(3005, () => {
      console.log("App started on port " + app.get('port'));
  });
});

module.exports = app;
