'use strict';

var helpers = require('../helpers.js');

module.exports = (app, db) => {

app.post('/profile', helpers.forceLogin, (req, res) => {
  var currentEmail = req.session.user.email; // get current logged in user's email
  var newEmail = req.body.email;
  var currentPassword = req.body.password;
  var newPassword = req.body.newPassword;
  var confirmNewPassword = req.body.confirmNewPassword;

  if(newPassword && confirmNewPassword){
    if(newPassword !== confirmNewPassword){
      return res.redirect('/profile?error=passwords_do_not_match');
    }
  }

  db.users.findOne({ where: { email: currentEmail } }).then(function (user) {
    if (!user.validPassword(currentPassword)) {
          return res.redirect('/profile?error=current_password_incorrect');
    } else {
      var updatedAttributes = {};
      // here we check if we recieved new attributes, as we don't want them to be set/updated as null
      if(newEmail){updatedAttributes.email = newEmail}
      if(newPassword){updatedAttributes.password = db.users.prototype.hashPassword(newPassword);}

      db.users.update(updatedAttributes, { where: { email: currentEmail } })
      .then(function(user){
          db.users.findOne({ where: { email: newEmail } }).then(function (user) {
            helpers.saveSession(req, user.dataValues, res.redirect('/profile?info=profile_updated'));
          });
      });
    }
  });

}); // end update profile

app.get('/profile', helpers.forceLogin, (req, res) => {
  res.render('pages/profile', { user: req.session.user, error: helpers.getError(req), info: helpers.getInfo(req) });
});

};
