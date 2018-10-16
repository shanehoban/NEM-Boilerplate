'use strict';

var routes = [
  require('./routes/users'),
  require('./routes/login-signup'),
  require('./routes/profile'),
  require('./routes/pages')
];

// Add access to the app and db objects to each route
module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db);
  });
};
