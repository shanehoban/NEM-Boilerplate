*   **N**ode
*   **E**xpressJS
*   **M**ySQL

Also included in this boilerplate:

*   Express Handlebars for templating
*   [Sequelize](http://docs.sequelizejs.com/) for MySQL CRUD operations
*   A users table with authentication built in
*   Bycrpt for password hashing
*   Session management via `express-session`
*   Bootstrap as a styling framework
*   Browserify to open up node modules to the browser
*   Browser sync to refresh the browser

#### Get Going

You will need to create a MySQL database first manually, however you see fit. It could be included here but the complications it imposes outweigh the ease of simply creating one manually.

1.  Clone the repo
2.  Run `yarn` or `npm install`
3.  A database name is required in `/database.js` <small>(Tables are generated via Sequelize)</small>
4.  Run `npm run dev` (after changes - no restart necessary, and browser refreshes automatically too)
5.  Open [http://localhost:3000](http://localhost:3000/)

#### To Run

In the base project folder, run: `npm run dev`

#### Developing From Here

CSS changes should be made in `client/sass/css`

#### Database Changes

All database changes are done via Sequelize, and you can upgrade/downgrade the database via [Sequelize migrations.](http://docs.sequelizejs.com/manual/tutorial/migrations.html)

There is a test migration already in the migrations folder. This alters the user table by adding a username field after the id column. Feel free to take a look at this migration file and understand what is going on - its quite simple really.

###### To run the test migration:

1.  First ensure you have previously run: `npm install` or `yarn` to initialize the project
2.  Next, in the base project folder, run the command: `node_modules/.bin/sequelize db:migrate`
3.  This will add the username column specified in the migrations file in the `/migrations` folder
4.  Take a look at your users table and see the new column in place (hopefully)
5.  Simply run `node_modules/.bin/sequelize db:migrate:undo` to revert the migration and remove the column
