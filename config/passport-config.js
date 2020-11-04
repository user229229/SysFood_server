// Import packages
const {Strategy, ExtractJwt} = require('passport-jwt');
const mongoose = require('mongoose')

// Configuring dotenv
require('dotenv').config();

const User = require('../models/user')

// This sets how we handle tokens from incoming requests
// and also defines the key to be used when verifying the token
const secret = process.env.SECRET;
const handleTokenConfigs = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}


module.exports = passport => {
    // Create a new JWT strategy. (Checkout http://www.passportjs.org/docs/ > Configure > Verify Callback)
    const newJWTStrategy = new Strategy(handleTokenConfigs, (payload, done) => {
      // When a token is received, use the payload.id field to find a matching user.
      User.findById(payload.id).then(user => {
        // if the user exist, call the done callback
        if (user) {
          return done(null, {
            id: user.id,
            name: user.name,
          });
        }
        // otherwise, call the done callback with false.
        return done(null, false)
      })
      .catch(err => {return done(err)})
    });

    passport.use(newJWTStrategy);
}



