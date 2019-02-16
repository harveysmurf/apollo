const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      req
        .getAuthenticationService()
        .login(email, password)
        .then(res => done(null, res))
        .catch(reason => {
          done(null, false, { message: 'hello' })
        })
    }
  )
)

module.exports = passport
