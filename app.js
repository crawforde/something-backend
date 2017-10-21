"use strict";

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var util = require('util');
var flash = require('connect-flash');

var models = require('./models');
var User = models.User;
var routes = require('./routes');
const domain = "https://something-horizons.herokuapp.com";

// Make sure we have all required env vars. If these are missing it can lead
// to confusing, unpredictable errors later.
var REQUIRED_ENV = ['MONGODB_URI'];
REQUIRED_ENV.forEach(function(el) {
  if (!process.env[el])
    throw new Error("Missing required env var " + el);
});

var app = express();
var IS_DEV = app.get('env') === 'development';

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var session = require('cookie-session');
app.use(session({
  keys: [ process.env.SECRET || 'fake secret' ]
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  if (! util.isString(username)) {
    done(null, false, {message: 'User must be string.'});
    return;
  }
  // Find the user with the given username
  User.findOne({ username: username, password: password }, function (err, user) {
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

app.get('/test', function(req, res) {
  res.json({
    running: true
  });
});

app.use(routes(passport));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (IS_DEV) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("Error: " + err.message + "\n" + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("Error: " + err.message);
});

module.exports = app;
