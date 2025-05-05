const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { signupSchema, signinSchema } = require("../middlewares/validator");
const User = require('../models/usersModel');
const { authenticateUser } = require('../middlewares/auth');
const { doHash, doHashValidation } = require('../utils/hashing');

// SIGNUP
exports.signup = async (req, res) => {
    const { email, password, username } = req.body;
    const file = req.file;

    try {
        const { error } = signupSchema.validate({ email, password, username });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }

        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await doHash(password, 12);

        let profileImage = null;
        if (file) {
            const imageBuffer = fs.readFileSync(file.path);
            const mimeType = file.mimetype;
            profileImage = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        }

        habitsData = [
            { habitId: "1", habitName: 'Yoga', habitDescription: 'Improve flexibility and calm your mind through controlled poses and breathing.'},
            { habitId: "2", habitName: 'Gym', habitDescription: 'Build strength and stamina with weight training and cardio workouts.', },
            { habitId: "3", habitName: 'Meditation', habitDescription: 'Reduce stress and improve focus through mindful breathing.'},
            { habitId: "4", habitName: 'Walking', habitDescription: 'Boost heart health and clear your mind with daily walks.'},
            { habitId: "5", habitName: 'Reading', habitDescription: 'Expand your knowledge and unwind with a good book.'},
            { habitId: "6", habitName: 'Stretching', habitDescription: 'Loosen tight muscles and prevent injuries through daily stretching.'},
            { habitId: "7", habitName: 'Earthing', habitDescription: 'Reconnect with nature by walking barefoot on natural ground.'},
            { habitId: "8", habitName: 'Cycling', habitDescription: 'Strengthen your legs and enjoy the outdoors with cycling.'},
            { habitId: "9", habitName: 'Dancing', habitDescription: 'Lift your mood and stay active with fun dance routines.'},
            { habitId: "10", habitName: 'Drink Water', habitDescription: 'Stay hydrated to improve energy and focus.'},
            { habitId: "11", habitName: 'Journaling', habitDescription: 'Organize your thoughts and reflect through writing.'},
            { habitId: "12", habitName: 'Skincare', habitDescription: 'Nourish your skin with a consistent self-care routine.' },
            { habitId: "13", habitName: 'DigitalDetox', habitDescription: 'Take a break from screens to refresh your mind and body.'},
            { habitId: "14", habitName: 'Cleaning', habitDescription: 'Create a tidy, stress-free space with regular cleaning.'},
            { habitId: "15", habitName: 'Cooking', habitDescription: 'Fuel your body and creativity through homemade meals.'}
        ];

        const habs = habitsData.map((habit, index) => {
            const normalizedName = habit.habitName.replace(/[^a-zA-Z]/g, '').toLowerCase();
            const imagePath = path.join(__dirname, '..', 'assets', 'defaultImages', `${normalizedName}.png`);
            
            let base64Image = null;
            try {
                const imageBuffer = fs.readFileSync(imagePath);
                base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
            } catch (err) {
                console.error(`Failed to load image for ${habit.habitName}:`, err.message);
            }
        
            return {
                habitId: `${index + 1}`,
                habitName: habit.habitName,
                habitDescription: habit.habitDescription,
                habitImage: base64Image, // embeds the actual image
            };
        });

        // Create default plans
        const defaultPlans = [
            {
                planId: `plan_${Date.now()}_1`,
                planName: "Sports",
                activities: []
            },
            {
                planId: `plan_${Date.now()}_2`,
                planName: "Learning",
                activities: []
            }
        ];

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            profileImage,
            habits: habs,
            plans: defaultPlans  // Add the default plans here
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
        }, process.env.TOKEN_SECRET,{
            expiresIn: '7d'
        });

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 * 3600000), 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                username: existingUser.username,
                email: existingUser.email,
                profileImage: existingUser.profileImage || null,
                habits: existingUser.habits,
                plans: existingUser.plans,
            }
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

exports.updateProfile = async (req, res) => {  
    if (!req.body || !req.body.email || !req.body.username) {
        return res.status(400).json({ message: "Missing email or username" });
      }
      
    const { email, username } = req.body;
    const file = req.file;
    try {
        let updateFields = {
            username,
          };          
        if (file) {
            const imageBuffer = fs.readFileSync(file.path);
            const mimeType = file.mimetype;
            base64ProfileImage = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
            updateFields.profileImage = base64ProfileImage;

        }
        const updatedUser = await User.findOneAndUpdate(
            { email }, // assuming update based on email
            updateFields,
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};