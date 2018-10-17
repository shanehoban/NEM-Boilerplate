var bcrypt = require('bcryptjs');

module.exports = (sequelize, type) => {

  var User = sequelize.define('users', {
      email: {
          type: type.STRING,
          allowNull: false,
          unique: {
              args: true,
              msg: 'Email address already in use!'
          }
      },
      password: {
          type: type.STRING,
          allowNull: false
      }
  }, {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
  });

  User.prototype.hashPassword = function(password){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
  };

  // setup User model and its fields.
  return User;

}
