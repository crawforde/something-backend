"use strict";

var router = require('express').Router();
var models = require('../models/models');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

router.post('/create', function(req, res) {
    var e = new models.Event({
      eventDate: req.body.eventDate,
      eventLocation: req.body.eventLocation,
      eventDescription: req.body.eventDescription,
      eventLatitude: req.body.eventLatitude,
      eventLongitude: req.body.eventLongitude
    });
    e.save(function(err, event) {
      if (err) {
        res.status(500);
        return;
      }
      res.status(200);
      res.json({success: true, event: event});
    });
})

router.get('/events', function(req, res, next) {
  // Gets all users
  console.log('GETS HERE')
  models.Event.find({}, function(err, events) {
    if (events) {
      console.log(events);
      res.json({success: true, events: events});
    } else {
      res.json({success: false, error: err})
    }
  })
});

router.get('/users/register', function(req, res) {
  console.log('connection successful');
  console.log(req.query.code)
  const user = new User({
    email: req.query.code
  })
  user
  .save(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      console.log('Google user save successful!');
    }
  });
});

router.get('/users', function(req, res) {
  console.log('connection successful');
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

module.exports = router;
