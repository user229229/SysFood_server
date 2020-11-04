// Importing packages
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Importing models
const User = require("../models/user");

// Set up dotenv and .env variables
require("dotenv").config();
const secret = process.env.SECRET;

// Setting up express router.
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

// Register route
router.post("/register", (req, res) => {
  // Find a user with the given email address already exist in DB.
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // If a user with that email exist, send back an error.
        let error = "A user with that email already exist.";
        return res.status(400).json(error);


      } else {
        // Otherwise, create a new user.
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
        }).then(newUser => {
          // Hash pw and store it in DB.
          bcrypt.hash(newUser.password, 10)
            .then(hash => {
              // Store hash in your password DB.
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => res.json(400).json(err));
            })
            .catch(err => {
              res.status(500).json(err);
            });
        }).catch((err) => res.status(500).json(err) );
      }
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// Login route
router.post("/login", (req, res) => {
  let error = {};
  // Extract email and pw from request.
  const email = req.body.email;
  const password = req.body.password;

  // Check to see if a user with that email already exist.
  User.findOne({ email }).then(user => {
    // If no user is found, send back an error.
    if (!user) {
      error.email = "No Accounts Found";
      return res.status(404).json(error);
    }

    // If it is then compare the pw hashes.
    bcrypt.compare(password, user.password).then(isMatch => {
      // If it is a match, sign the token and send it back.
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.username
        };

        jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
          if (err) {
            res.status(500).json({ error: "Error signing token" });
          }

          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      } else {
        // If pw hashes don't match, send back an error
        error.password = "Password is incorrect!";
        res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
