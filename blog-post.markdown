# Introduction

I've been developing side projects on the LAMP stack for a good few years now. There were numerous occasions where I have tried to create something that 'sticks' too - to no avail. NodeJS has been around for quite a while now, and I've tried a couple of times to find out why it is: 'so hot right now'. For those interested, currently I'm working on Survais.com in my spare time (from time to time). Plug over, moving on.

I like to build things from scratch to truly understand how things work. So when I need an authentication system, I build it. If I need a forgot password service, I build that too. Transactional emails, payments (fine I incorporate stripe), authentication (oauth), etc.

Recently, I tried once again to see if I can get a NodeJS app up and running, just as quick as I would a PHP project. Obviously it took much longer as I had to learn a lot of new stuff, but sure enough I got a basic app running eventually.

# Things I Like About PHP

These are points that I really love about PHP, and I wanted to be able to replicate these in Node with ease.

* The ability to include/require with ease is by far my favorite part about PHP
* A close second is that session management is so simple
* Connecting to the database via PDO, quite 'elementary'
* Project setup time is very low for me with PHP (due to experience I imagine)

# The Code

**All the code for this writeup is located in a repository called NEM Boilerplay, located here: https://github.com/shanehoban/NEM-Boilerplate. Please download this and follow the instructions in the readme to get the app running locally to follow along.**

Download the code for this project here: https://github.com/shanehoban/NEM-Boilerplate. You will need this as we go along for reference. Follow the instructions on the repository's readme to get the local app running on your machine (not really a requirement). You will need to manually create a database (the default name used for this project is nem-boilerplate) to have full signup/login capabilities.

# Noteworthy Files

*app.js*

In the base of the project, there is a file called `app.js`. This is essentially the server code. This includes the web server, session management, SaSS compilers, automatic reload in your browser, and anything else you could ever need really. You can include a package by installing it from npm (or yarn) and including it in your app (see the top of app.js for examples of including modules from npm). This is quite a complicated file, but take some time to go through it and understand what's going on.

If you are trying to track something down, it started somewhere in app.js, so best bet is to start there.

*database.js*

Also in the base of the project there is a file called `database.js`. This sets up the connection to the MySQL database (the default name for the database this project uses is nem-boilerplate). For the sake of this project, we are also assuming locally you can access your MySQL with the username `root` without the need for a password. You will have to create the database yourself manually. All tables and changes to tables are done via Sequelize. You won't be creating anything other than the database itself manually. Take a look at this file, it's quite simple and hopefully self explanatory.

# PHP Include Equivalent in Node

For this, we must use a templating engine. For the NEM Boilerplate project, we use Express Handlebars. You can see how it is set up in `app.js`. A PHP include equivalent in Handlebars is called a partial. Actually, the layout for your page is broken down a bit - if you see the `/views` folder, we have a:
  - /layouts
  - /pages
  - /partials => this is where your includes would be
  - error.hbs => 404 page for example
  - index.hbs => our homepage (we could include this in `pages`, or anywhere for that matter)

The `/layouts/layout.hbs` is our base webpage, containing all our includes. In handlebars, you include a partial like so `{{> mypartial.hbs}}`.

Quite simple in theory, but took me some time to get everything working initially.

We set up our handlebars 'view engine' in `app.js`. So when the app gets a route that requires rendering the page, this is the view engine that gets used (I hope I've explained, or even understood that myself correctly).

# PHP Session Management Equivalent in Node Using Express Sessions

In PHP it is as simple as `session_start()` and accessing/setting session variables via `$_SESSION['myUserID']` or whatever. I love this about PHP. I hoped it would be just as easy with Node. Well, it kind of is.

First we include the express-session module in our `app.js` at the top via `var session = require('express-session');`

Then later down the file, we tell the app to use this module in our app via something like this:

    // initialize express-session to allow us track the logged-in user across sessions
    app.use(session({
        key: 'nem-boilerplate-sesh',
        secret: 'big_fat_random_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000
        }
    }));

When a user logs in, how do we know? How do we for example, restrict access to a page if the user is not logged in?

Well, this is done in our routes. I created a file `router/helpers.js` manually. In each route located in `router/routes/`, I include this helpers file to gain access to the functions within in (like how a PHP file include works). This helper file contains the function `saveSession`:

    saveSession: function(req, user, redirect) {
      delete(user.password);
      req.session.user = user;

      if(redirect){
        return redirect();
      }
    },

It takes the request (which is passed to any get/post request for example), the new user object that should be saved (as this is what we use to maintain a session), and if passed a callback (which would be a redirect in this case), calls that function too. Because it takes a full user object, we don't really want or need to save the password in the session - so this is deleted.

Then just like PHP session variables are assigned, we do the same thing here in JavaScript like so: `req.session.user = user;`.

# PDO Equivalent in Node (via Sequelize)

PDO is a breeze to use for me. I was hoping it would be just as easy with Node, and it kind of was. Well it opened my eyes a bit anyway regarding the use of Models.

I used to create all my tables manually, and hook up my PHP code to insert, update, delete (well I never actually use delete but you get the idea). So I'd manually create API code to handle all of this for each new table/record, depending on the use case for each one of course.

Using Sequelize has made me realise how much nicer it is to work with Models. You don't even have to create the table anymore. Sequelize does it all for you. Sure you have to create the Model yourself, but this is a nicer, more centralized approach in my opinion.

I was a bit worried about making changes to the database because god knows, when creating your own APIs manually, this is the biggest pain point. Not as much with Sequelize it seems. It is a bit tricky getting what's called a `migration` set up the first time. But once you have it working, it's definitely attractive.

I have included a sample migration in the `/migrations` folder in the project. Instructions on how to run a migration are in the projects readme here: https://github.com/shanehoban/NEM-Boilerplate#database-changes

The `router/routes/` folder is essentially where our API lives (if we want it to) which I find to be refreshing. It allows everything to live in one place instead of having to pass URL parameters to indicate what your API should do.

Take some time to look at the `router/routes/` files to see how to interact with the database. Remember that we had passed the `db` variable to each route from our `app.js` file. The `/router/routes/login-signup.js` file has examples of reading and inserting data. The `router/routes/profile.js` file has examples of updating data.

# Project Set Up Time

Yes this took me some time to get all the cogs working together, but using this as a base moving forward is a good step in the right direction. I'm still not sure if I were to create a new project tomorrow would I use Node or PHP. I still have a lot to figure out before deploying something to production, such as:

  - SSL Certs
  - Subdomains
  - I'm drawing a blank here, writers block?

# Thank You

Please feel free to create pull requests/clone/fork/do whatever with this project as you wish. There is also a copy of this blog post in the repository in markdown format.
