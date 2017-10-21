"use strict";

const router = require('express').Router();

router.get('/test', function(req, res) {
  res.json({
    running: true
  });
});

module.exports = router;
