// Package Imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');

// Initializing express.
const app = express();

// Configuring dotenv to read configs from a .env file.
dotenv.config(); 

// Configuring Mongoose
const dbURL = process.env.DB_URL;
mongoose.set("useCreateIndex", true);   // Avoids deprecation warnings from MongoDB driver.
mongoose.connect(dbURL, {useNewUrlParser: true})
       .then(_ => console.log('Connected Successfully to MongoDB'))
       .catch(err => console.error(err));

// Configuring Passport
app.use(passport.initialize()); // Initializes the passport configuration.
require('./config/passport-config')(passport); //imports our configuration file which holds our verification callbacks and things like the secret for signing.



// Middleware.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//custom Middleware for logging the each request going to the API
// app.use((req,res,next) => {
//       const log = {console}
//       if (req.body) log.info(req.body);
//       if (req.params) log.info(req.params);
//       if(req.query) log.info(req.query);
//       log.info(`Received a ${req.method} request from ${req.ip} for                ${req.url}`);
//     next();
// });


// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const privateRouter = require('./routes/private');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(
  "/secure",
  passport.authenticate("jwt", { session: false }),
  privateRouter
);

module.exports = app;
