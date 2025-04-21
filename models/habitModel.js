const {required} = require('joi');
const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    habitID: {
        type: Number,
        required: [true, 'Habit ID is required!'],
        unique: [true, 'Habit ID must be unique!'],
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
        required: [true, 'Habit image is required!'],
        trim: true
    },

    // ⏰ New fields
    startTime: {
        type: String, // or Date if you want full datetime
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

    // Optional: Days of week this habit repeats
    daysOfWeek: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: [true, 'At least one day is required']
    },

    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required!']
    },
    isPublish: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);