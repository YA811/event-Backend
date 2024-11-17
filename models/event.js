const mongoose = require('mongoose');


const listSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    invitationStatus:{
        type: String,
        enum: ['pending', 'accepted', 'rejected']
    }
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        },
    location: {
        type: String,
        required: true
        },
    planner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: [listSchema]
    
});


module.exports = mongoose.model('Event', eventSchema);