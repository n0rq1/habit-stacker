const { habitSchema } = require("../middlewares/validator");
const User = require('../models/usersModel');
const { v4: uuidv4 } = require('uuid'); 

const normalizeHabitName = (habitName) => {
    return habitName.replace(/\s+/g, '').toLowerCase();
};

exports.createHabit = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { error, value } = habitSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const habitId = uuidv4();
        const normalizedHabitName = normalizeHabitName(value.habitName);

        const exists = user.habits.some(habit => normalizeHabitName(habit.habitName) === normalizedHabitName);
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "A habit with this name already exists"
            });
        }

        value.habitId = habitId;
        user.habits.push(value);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Habit added successfully",
            habit: value
        });

    } catch (err) {
        console.error("Create Habit error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getHabits = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('habits');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            habits: user.habits
        });

    } catch (err) {
        console.error("Get Habits by userId error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const userId = req.user._id;
        const habitId = req.params.habitId;
        const updates = req.body;

        delete updates.normalizedHabitName;

        if (updates.habitName) {
            updates.normalizedHabitName = normalizeHabitName(updates.habitName);
        }

        const { error } = habitSchema.validate(updates, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const habit = user.habits.find(h => h.habitId === habitId);
        if (!habit) {
            return res.status(404).json({ success: false, message: "Habit not found" });
        }

        if (updates.habitName) {
            const normalizedUpdatedName = normalizeHabitName(updates.habitName);
            const exists = user.habits.some(h => normalizeHabitName(h.habitName) === normalizedUpdatedName);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "A habit with this name already exists"
                });
            }
        }

        Object.keys(updates).forEach(key => {
            habit[key] = updates[key];
        });

        await user.save();

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

exports.removeHabit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { habitId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const habitIndex = user.habits.findIndex(habit => habit.habitId === habitId);
        if (habitIndex === -1) {
            return res.status(404).json({ success: false, message: "Habit not found" });
        }

        user.habits.splice(habitIndex, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Habit removed successfully'
        });

    } catch (err) {
        console.error("Remove Habit error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};