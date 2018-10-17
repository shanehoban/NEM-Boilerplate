'use strict';

var helpers = require('../helpers.js');

/*
    This is a hidden page, just to see how adding variables to the url works
*/

module.exports = (app, db) => {

  // GET all users
  app.get('/users', helpers.forceLogin, (req, res) => {
    db.users.findAll()
      .then(users => {
        res.render('pages/users', { user: req.session.user, users: users });
      });
  });

  // GET one owner by id
  app.get('/user/:email', helpers.forceLogin, (req, res) => {
    var email = req.params.email;
    db.users.find({
      where: { email: email}
    })
      .then(user => {
        res.render('pages/user', { user: user });
      });
  });

};
