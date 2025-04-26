const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    habitID: {
        type: Number,
        required: [true, 'Habit ID is required!'],
        trim: true,
    },
    habitName: {
        type: String,
        required: [true, 'Habit name is required!'],
        trim: true,
        minLength: [3, 'Habit name must be at least 3 characters!'],
        maxLength: [40, 'Habit name must be less than 40 characters!']
    },
    habitDescription: {
        type: String,
        trim: true
    },
    habitImage: {
        type: String,
        required: false,
        trim: true
    },
    habitMinTime: {
        type: Number,
        required: true,
        trim: true
    },
    habitMaxTime: {
        type: Number,
        required: true,
        trim: true
    },
    preferredTime: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: String, 
        required: [true, 'Start time is required!'],
        trim: true
    },
    endTime: {
        type: String,
        required: [true, 'End time is required!'],
        trim: true,
        validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: 'End time must be after start time'
        }
    },
    daysOfWeek: {
        type: [String],
        required: false,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
