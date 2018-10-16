var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var exphbs  = require('express-handlebars');
var sassMiddleware = require('node-sass-middleware');
var browserify = require('browserify-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var router = require('./router/index');
var db = require('./database');
var app = express();

var hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  // Specify helpers which are only registered on this instance.
  helpers: {
      foo: function () { return 'foo'; },
      bar: function () { return 'bar'; }
  }
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // hbs is the file extension we use

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

// initialize express-session to allow us track the logged-in user across sessions.
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

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// first parameter is the mount point, second is the location in the file system
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/img", express.static(__dirname + "/client/img"));
app.use("/css", express.static(__dirname + "/client/css"));

router(app, db);

app.get('/logout', (req, res) => {
  res.clearCookie('user_sid');
  res.redirect('/');
});

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

db.sequelize.sync(/*{ force: true }*/) // force true causes the database to be dropped
  .then(() => {
    app.listen(3005, () => {
      console.log("App started on port " + app.get('port'));
  });
});

module.exports = app;
