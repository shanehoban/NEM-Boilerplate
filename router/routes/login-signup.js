'use strict';

var helpers = require('../helpers.js');

module.exports = (app, db) => {

  app.get('/logout', (req, res) => {
    res.clearCookie('user_sid');
    return res.redirect('/');
  });

  app.get('/login', (req, res) => {
    res.render('pages/login', { error: helpers.getError(req), info: helpers.getInfo(req) });
  });

  app.get('/signup', (req, res) => {
    res.render('pages/signup', { error: helpers.getError(req), info: helpers.getInfo(req) });
  });

  app.post('/login', (req, res) => {
      var email = req.body.email;
      var password = req.body.password;

      db.users.findOne({ where: { email: email } }).then(function (user) {
          if (!user) {
              res.redirect('/login?error=user_does_not_exist');
          } else if (!user.validPassword(password)) {
              res.redirect('/login?error=email_password_combo_incorrect');
          } else {
            helpers.saveSession(req, user.dataValues, redirect => res.redirect('profile'));
          }
      });
  });

  app.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if(password === confirmPassword){
      db.users.create({
          email: req.body.email,
          password: req.body.password
      })
      .then(user => {
          helpers.saveSession(req, user.dataValues, redirect => res.redirect('profile'));
      })
      .catch(error => {
          res.redirect('/signup?error=unexpected_error&' + error);
      });
    } else {
      res.redirect('/signup?error=passwords_do_not_match');
    }

  });


};
