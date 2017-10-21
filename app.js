var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20');
//var google = require('./config');
var util = require('util');
var session = require('cookie-session');
var models = require('./models/models');
var { User } = require('./models/models');
var auth = require('./routes/auth');
var routes = require('./routes/routes');

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
// const transformGoogleProfile = (profile) => ({
//   name: profile.displayName,
//   avatar: profile.image.url,
// });

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));


// passport.use(new GoogleStrategy({
//     clientID:     process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL,
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     models.User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// passport.use(new GoogleStrategy({
//     clientID:     process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL,
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// Initialize http server
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  keys: [ process.env.SECRET || 'fake secret' ]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
// app.use(auth(passport));
// app.use(routes);

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => res.redirect('/users/' + req.user));

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  if (! util.isString(username)) {
    done(null, false, {message: 'User must be string.'});
    return;
  }
  // Find the user with the given username
  models.User.findOne({ username: username, password: password }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      done(err);
      return;
    }
    // if no user present, auth failed
    if (!user) {
      done(null, false, { message: 'Incorrect username/password combination.' });
      return;
    }

    // auth has has succeeded
    done(null, user);
  });
}));

//ROUTES
//
// app.get('/auth/google',
//   passport.authenticate('google', { scope:
//   	[ 'https://localhost:3000/auth/plus.login',
//   	  'https://localhost:3000/auth/plus.profile.emails.read' ] }
// ));
//
// app.get( '/users/register',
// 	passport.authenticate( 'google', {
// 		successRedirect: '/users',
// 		failureRedirect: '/login'
// }));



module.exports = app;
