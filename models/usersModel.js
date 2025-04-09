const {required} = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        unique: [true, 'Username must be unique!'],
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [15, 'Username must be at most 30 characters'],
    },
    email:{
        type: String,
        required: [true,'Email is required!'],
        trim: true,
        unique: [true, 'Email must be unique!'],
        minLength: [5, 'Email must have at least 5 characters!'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password must be provided!'],
        trim: true,
        select:false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String, 
        select: false,
    },
    verificationCodeValidation: {
        type: String, 
        select: false,
    },
    forgotPasswordCode: {
        type: String, 
        select: false,
    },
    forgotPasswordCodeValidation: {
        type: Number, 
        select: false,
    }
},{
    timestamps:true
});

module.exports = mongoose.model('User',  userSchema);