
module.exports = {

  forceLogin: function(req, res, next){
      if (!req.session.user) {
          res.redirect('/login');
      } else {
          next();
      }
  },

  saveSession: function(req, user, redirect) {
    delete(user.password);
    req.session.user = user;

    if(redirect){
      redirect();
    }
  },

  getError: function(req) {
    var error;

    if(req.query.error){
      switch (req.query.error) {

        case 'passwords_do_not_match':
        error = 'New passwords did not match.';
        break;

        case 'current_password_incorrect':
        error = 'Your current password was incorrect.';
        break;

        case 'user_does_not_exist':
        error = 'Account does not exist.';
        break;

        case 'email_password_combo_incorrect':
        error = 'Your login details were incorrect.';
        break;

        case 'unexpected_error':
        error = 'An unexpected error has occured.';
        break;


        default:
        error = null;
        break;
      }
    }

    return error;
  },


  getInfo: function(req) {
    var info;

    if(req.query.info){
      switch (req.query.info) {
        case 'profile_updated':
        info = 'Your profile has been updated.';
        break;
        default:
          info = null;
        break;
      }
    }

    return info;
  }

};
