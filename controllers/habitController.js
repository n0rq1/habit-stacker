const Habit = require('../models/habitModel');
const { habitSchema } = require("../middlewares/validator");

exports.createHabit = async (req, res) => {
    try {
        const { error, value } = habitSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }

        const userId = req.user._id;

        const exists = await Habit.findOne({ habitID: value.habitID, createBy: userId });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "You already have a habit with this ID"
            });
        }

        const newHabit = new Habit({
            ...value,
            createBy: userId
        });

        const savedHabit = await newHabit.save();

        res.status(201).json({
            success: true,
            message: "Habit created successfully",
            habit: savedHabit
        });

    } catch (err) {
        console.error("Create Habit error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getHabits = async (req, res) => {
    try {
        const userId = req.user._id;

        const habits = await Habit.find({ createBy: userId });

        res.status(200).json({
            success: true,
            habits
        });

    } catch (err) {
        console.error("Get Habits error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const userId = req.user._id;
        const habitID = req.params.habitId;
        const updates = req.body;

        const { error } = habitSchema.validate(updates, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }

        const habit = await Habit.findOneAndUpdate(
            { habitID, createBy: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Habit updated successfully',
            habit
        });

    } catch (err) {
        console.error("Update Habit error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};