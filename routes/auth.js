"use strict";

var express = require('express');
var { User, Message } = require('../models');
var _ = require('underscore');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = function (passport) {
  var router = express.Router();

  /* Authentication routes */

  router.get('/login/failure', function(req, res) {
    res.status(401).json({
      success: false,
      error: req.flash('error')[0]
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
    failureFlash: true
  }));

  router.post('/register', function(req, res, next) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    //var params = _.pick(req.body, ["username", "password"]);
    user.save(function(err, user) {
      if (err) {
        res.status(400).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          user: user
        });
      }
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.json({
      success: true,
      message: 'logged out.'
    });
  });

  router.get('/login/success', function(req, res) {
    var user = _.pick(req.user, 'username', '_id');
    res.json({
      success: true,
      user: user
    });
  });


  router.use('/', function(req,res,next){
    if(req.user){
      next();
    }
    else{
      res.status(401).json({
        success: false,
        error: 'Error: Session not found. Please log in to see content.'
      });
    }
  });


  router.get('/users', function(req, res) {
    User
    .find()
    .exec(function(err, users) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          // TODO simplify this
          users: users.map(_.partial(_.pick, _, ['username', '_id']))
        });
      }
    });
  });

  router.get('/messages', function(req, res) {
    Message.find({
      $or:[
        {to: req.user._id},
        {from: req.user._id}
      ]
    })
      .sort({
        timestamp: -1
      })
      .populate('to from', 'username')
      .exec(function(err, messages) {
        if (err) {
          res.status(500).json({
            success: false,
            error: err.message
          });
        } else {
          res.json({
            success: true,
            messages: messages
          });
        }
      });
  });

  router.post('/messages', function(req, res) {
    var params = _.pick(req.body, ['body', 'location', 'to']);
    params.from = req.user._id;
    new Message(params).save(function(err, message) {
      if (err) {
        res.status(400).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          message: message
        });
      }
    });
  });

  return router;
};
