const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const UserModel = require('./models/users')

let verify = function(email, password) {
    return UserModel.findOne({
      email,
      password
    }).exec()
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  {
      usernameField: 'email',
      passwordField: 'password'
  },
  function(email, password, done) {
    verify(email, password)
    .then((res) => done(null, res))
    .catch((reason) => done(null, false, {message: 'hello'}))
  }
))

module.exports = passport
