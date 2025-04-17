const {required} = require('joi');
const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    habitID: {
        type: Number,
        required: [true, 'Habit ID is required!'],
        trim: true,
        unique: [true, 'Habit ID must be unique!'],
    },
    habitName:{
        type: String,
        required: [true,'Habit name is required!'],
        trim: true,
        //unique: [false, 'Email must be unique!'], not sure if this needs to be unique for the user
        minLength: [3, 'Habit name must be at least 3 characters!'],
        maxLength: [40, 'Habit name must be less than 40 characters!']
    },
    habitDescription: {
        type: String,
        trim: true
    },
    habitImage: {
        // type: Boolean, not sure what to put for this 
        required: [true, 'Habit image is required!']
    },
    habitMinTime: {

    },
    habitMaxTime: {

    },
    preferredTime: {

    },
    createBy: {

    },
    isPublish: {
        type: Boolean
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Habit',  habitSchema);