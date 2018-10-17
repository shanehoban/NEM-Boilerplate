# Introduction

I'm used to the LAMP stack. I've built and failed numerous times when trying to create something that sticks too, all with LAMP. NodeJS has been around for quite a while now, and I have tried a couple of times to try and find out why it is 'so hot right now'. Currently I'm working on Survais.com. Plug over, let's keep going.

I like to build things from scratch to truly understand how things work. So when I need an authentication system, I build it. If I need a forgot password service, I build that too. Transactional emails, payments, authentication (oauth).... etc. So, I've rebuilt a few things numerous times over as I started on new projects/ideas. I don't mind doing that either. I find the code and reliability improves with each iteration.

Recently, I tried once again to see if I can get a NodeJS app up and running, just as quick as I would a PHP project. Obviously it took much longer as I had to learn a lot of new stuff, but sure enough I got a basic app running eventually. In this post I'm going to detail the nuances of converting from a typical PHP app to a NodeJS app. This will include but not limited to:

* MySQL connection (also using Models - which I never previously used)
* Session management
* Partials (equivalent to PHP includes)

# Things I Like About PHP

These are points that I really love about PHP, and I wanted to be able to replicate these after moving over to Node.

* The ability to simply include/require with ease is by far my favorite part about PHP
* A close second is that session management is so simple
* Connecting to the database via PDO, again is very easy to get going
* Project setup time is very low

# The Code

**All the code for this writeup is located in a repository called NEM Boilerplay, located here: https://github.com/shanehoban/NEM-Boilerplate. Please download this and follow the instructions in the readme to get the app running locally to follow along.**

Download the code for this project here: https://github.com/shanehoban/NEM-Boilerplate. You will need this as we go along for reference. Follow the instructions on the repository's readme to get the local app running on your machine. Remember that you will need to manually create a database (the default name used for this project is nem-boilerplate).

# Noteworthy Files and Folders

*app.js*

In the base of the project, there is a file called `app.js`. This is essentially the server code. This includes the web server, session management, SaSS compilers, automatic reload in your browser, and anything else you could ever need really. You can include a package by installing it from npm (or yarn) and including it in your app (see the top of app.js for examples of including modules from npm). This is quite a complicated file, but take some time to go through it and understand what's going on.

*database.js*

Also in the base of the project there is a file called `database.js`. This sets up the connection to the MySQL database (the default name for the database this project uses is nem-boilerplate). For the sake of this project, we are also assuming locally you can access your MySQL with the username `root` without the need for a password. You will have to create the database yourself manually. All tables and changes to tables are done via Sequelize. You won't be creating anything other than the database itself manually. Take a look at this file, it's quite simple and hopefully self explanatory.
