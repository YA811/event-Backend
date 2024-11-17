const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Event = require('../models/event.js');
const router = express.Router();

router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    req.body.planner = req.user._id;
    const event = await Event.create(req.body);
    event._doc.planner = req.user;
    res.status(201).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;