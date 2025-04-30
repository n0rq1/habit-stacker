const {required} = require('joi');
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    activities: [{
        habit: {
            habitId: {
                type: String,
                required: true
            },
            habitName: {
                type: String,
                required: true
            },
            habitDescription: {
                type: String
            },
            habitImage: {
                type: String
            }
        },
        dates: [String],
        times: [Number],
        timeOfDay: [String],
        status: [Boolean]
    }]
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: Number, 
        required: true
    },
    timeOfDay: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening'],
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, { _id: false });

const habitSchema = new mongoose.Schema({
    habitId: {
        type: String,
        required: true
    },
    habitName: {
        type: String,
        required: true
    },
    habitDescription: {
        type: String
    },
    habitImage: {
        type: String
    }
}, { _id: false }); 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        unique: [true, 'Username must be unique!'],
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [15, 'Username must be at most 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
        unique: [true, 'Email must be unique!'],
        minLength: [5, 'Email must have at least 5 characters!'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password must be provided!'],
        trim: true,
        select: false
    },
    profileImage: {
        type: String,
        default: null
    },
    habits: [habitSchema],
    plans: [planSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
