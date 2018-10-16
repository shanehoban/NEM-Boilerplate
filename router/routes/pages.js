'use strict';

var helpers = require('../helpers.js');

module.exports = (app, db) => {

  app.get(['/index', '/'], (req, res) => {
    res.render('index', {
      user: req.session.user,
      year: new Date().getFullYear(),
      error: helpers.getError(req),
      info: helpers.getInfo(req)
    });
  });

  app.get('/dashboard', helpers.forceLogin, (req, res) => {
    // will get login if not logged in
    res.render('pages/dashboard', { user: req.session.user });
  });

};
