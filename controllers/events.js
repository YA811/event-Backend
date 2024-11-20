const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Event = require('../models/event.js');
const router = express.Router();

router.use(verifyToken);

// CREATE
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



// INDEX
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({planner: req.user._id})
      .populate('planner')
      .sort({ createdAt: 'desc' });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error);
  }
});

// SHOW 
router.get('/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).populate('planner')
         if (!event.planner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!")
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json(error)
    }
})

// UPDATE 
router.put('/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        if (!event.planner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!")
        }
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            req.body,
            { new: true }
        )
        updatedEvent._doc.planner = req.user

        res.status(200).json(updatedEvent)
    } catch (error) {
        res.status(500).json(error)
    }
});

//delete
router.delete('/:eventId', async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event.planner.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
      const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
      res.status(200).json(deletedEvent);
    } catch (error) {
      res.status(500).json(error);
    }
  });

// CREATE attendees list
router.post('/:eventId/attendees', async (req, res) => {
    try {
        req.body.planner = req.user._id
        const event = await Event.findById(req.params.eventId);
        if (!event.planner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        event.attendees.push(req.body)
        await event.save()
        const newAttendee = event.attendees[event.attendees.length - 1]
        newAttendee._doc.planner = req.user
        res.status(201).json(newAttendee)
    } catch (error) {
        res.status(500).json(error)
    }
});

//update attendee
router.put('/:eventId/attendees/:attendeeId', async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event.planner.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
      const attendee = event.attendees.id(req.params.attendeeId);
      attendee.name = req.body.name;
      attendee.invitationStatus = req.body.invitationStatus;
      await event.save();
      res.status(200).json({ message: 'Ok' });
    } catch (error) {
      res.status(500).json(error);
    }
  });


  //delete attendees
router.delete('/:eventId/attendees/:attendeeId', async (req, res)=>{
    try{
        const event = await Event.findById(req.params.eventId);
        if (!event.planner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        event.attendees.remove({_id: req.params.attendeeId});
        await event.save();
        res.status(200).json({ message: 'attendee deleted' });
    }
    catch (error) {
        res.status(500).json(error)
    }
  });

module.exports = router;