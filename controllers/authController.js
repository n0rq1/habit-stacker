const jwt = require('jsonwebtoken');
const { signupSchema, signinSchema } = require("../middlewares/validator");
const User = require('../models/usersModel');
const { doHash, doHashValidation } = require('../utils/hashing');

// SIGNUP
exports.signup = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const { error, value } = signupSchema.validate({ email, password, username });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        //if the username already exists
        const existingUsername = await User.findOne({ username });
        console.log(username)
        if (existingUsername) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }

        //if the email already exists
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await doHash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });

        const result = await newUser.save();
        result.password = undefined; 

        res.status(200).json({
            success: true,
            message: "Your account has been created!",
            result,
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// SIGNIN
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        const isValid = await doHashValidation(password, existingUser.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            username: existingUser.username,
            verified: existingUser.verified,
        }, process.env.TOKEN_SECRET);

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            message: "Logged in successfully",
            token,
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.signout = async (req, res) => {
    res.clearCookie('Authorization')
       .status(200)
       .json({ success: true, message: "Logged out successfully" });
};
