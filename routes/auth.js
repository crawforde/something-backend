"use strict";

var express = require('express');
var _ = require('underscore');
var router = require('express').Router();
var models = require('../models/models');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



module.exports = function (passport) {
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

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
    const user = new models.User({
      username: req.body.username,
      password: req.body.password
    })
    console.log('USER', user);
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

  router.post('/register', function(req, res) {
      if (!validateReq(req.body)) {
        console.log('no req.body')
      }
      var u = new models.User({
        username: req.body.username,
        password: req.body.password
      });
      u.save(function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/register');
          return;
        }
        res.status(200);
      });
  })

  router.get('/logout', function(req, res) {
    req.logout();
    res.json({
      success: true,
      message: 'logged out.'
    });
  });

  router.get('/login/success', function(req, res) {
    var user = _.pick(req.user, 'username', '_id');
    console.log('NEW USER MADE')
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

  return router;
};
