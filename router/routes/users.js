'use strict';

var helpers = require('../helpers.js');

module.exports = (app, db) => {

  // GET all owners
  app.get('/users', helpers.forceLogin, (req, res) => {
    db.users.findAll()
      .then(users => {
        res.render('users/users', { user: req.session.user, users: users });
      });
  });

  // GET one owner by id
  app.get('/user/:email', helpers.forceLogin, (req, res) => {
    var email = req.params.email;
    db.users.find({
      where: { email: email}
    })
      .then(user => {
        res.render('users/user', { user: user });
      });
  });

  // // POST single owner
  // app.post('/owner', (req, res) => {
  //   const name = req.body.name;
  //   const role = req.body.role;
  //   db.owners.create({
  //     name: name,
  //     role: role
  //   })
  //     .then(newOwner => {
  //       res.json(newOwner);
  //     })
  // });

  // // PATCH single owner
  // app.patch('/owner/:id', (req, res) => {
  //   const id = req.params.id;
  //   const updates = req.body.updates;
  //   db.owners.find({
  //     where: { id: id }
  //   })
  //     .then(owner => {
  //       return owner.updateAttributes(updates)
  //     })
  //     .then(updatedOwner => {
  //       res.json(updatedOwner);
  //     });
  // });
  //
  // // DELETE single owner
  // app.delete('/owner/:id', (req, res) => {
  //   const id = req.params.id;
  //   db.owners.destroy({
  //     where: { id: id }
  //   })
  //     .then(deletedOwner => {
  //       res.json(deletedOwner);
  //     });
  // });

};
