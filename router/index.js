'use strict';

// we have an array of routes that we loop through below
var routes = [
  require('./routes/users'),
  require('./routes/login-signup'),
  require('./routes/profile'),
  require('./routes/pages')
];

// we are exporting the router function here (which is called in app.js)
// Add access to the app and db objects to each route - which was passed in app.js
module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db);
  });
};
