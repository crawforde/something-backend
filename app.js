var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var FacebookStrategy = require('passport-facebook');
var auth = require('./routes/auth');
var routes = require('./routes/routes');
// Import Facebook and Google OAuth apps configs
// var { facebook } = require('./config');

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile) => ({
  name: profile.name,
  avatar: profile.picture.data.url,
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
  // Gets called when user authorizes access to their profile
  async (accessToken, refreshToken, profile, done)
  // Return done callback and pass transformed user object
  => done(null, transformFacebookProfile(profile._json))
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Initialize http server
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login/failure' }),
// Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
(req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// //ROUTES
app.use(routes);
app.use(auth(passport));

module.exports = app;


// "use strict";
//
// var express = require('express');
// var path = require('path');
// var bodyParser = require('body-parser');
// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// var util = require('util');
// var flash = require('connect-flash');
//
// var { User } = require('./models');
//
// // Make sure we have all required env vars. If these are missing it can lead
// // to confusing, unpredictable errors later.
// var REQUIRED_ENV = ['MONGODB_URI'];
// REQUIRED_ENV.forEach(function(el) {
//   if (!process.env[el])
//     throw new Error("Missing required env var " + el);
// });
//
// var app = express();
// var IS_DEV = app.get('env') === 'development';
//
// app.use(flash());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
//
// var session = require('cookie-session');
// app.use(session({
//   keys: [ process.env.SECRET || 'fake secret' ]
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//
// // passport strategy
// passport.use(new LocalStrategy(function(username, password, done) {
//   if (! util.isString(username)) {
//     done(null, false, {message: 'User must be string.'});
//     return;
//   }
//   // Find the user with the given username
//   User.findOne({ username: username, password: password }, function (err, user) {
//     // if there's an error, finish trying to authenticate (auth failed)
//     if (err) {
//       done(err);
//       return;
//     }
//     // if no user present, auth failed
//     if (!user) {
//       done(null, false, { message: 'Incorrect username/password combination.' });
//       return;
//     }
//
//     // auth has has succeeded
//     done(null, user);
//   });
// }));
//
// //ROUTES
// app.use(routes);
// app.use(auth(passport));
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (IS_DEV) {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.send("Error: " + err.message + "\n" + err);
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.send("Error: " + err.message);
// });
//
// module.exports = app;
