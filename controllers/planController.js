const jwt = require('jsonwebtoken');
const User = require('../models/usersModel'); 
const { v4: uuidv4 } = require('uuid');

exports.createPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        const { planName, activities } = req.body;

        if (!planName || !activities || activities.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Plan name and at least one activity must be provided!"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const pid = uuidv4();
        const newPlan = {
            planId: pid,
            planName,
            activities: []
        };

        for (let activity of activities) {
            const habit = user.habits.find(h => h.habitId === activity.habitId);

            if (!habit) {
                return res.status(404).json({
                    success: false,
                    message: `Habit with habitId ${activity.habitId} not found for the user`
                });
            }

            newPlan.activities.push({
                habit: {
                    habitId: habit.habitId,
                    habitName: habit.habitName,
                    habitDescription: habit.habitDescription,
                    habitImage: habit.habitImage
                },
                dates: activity.dates,
                times: activity.times,
                timeOfDay: activity.timeOfDay,
                status: activity.status
            });
        }

        user.plans.push(newPlan);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            plan: newPlan
        });

    } catch (err) {
        console.error("Create Plan by userId error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            plans: user.plans || []
        });
    } catch (err) {
        console.error("Get Plans by ID error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        Object.keys(updates).forEach(key => {
            plan[key] = updates[key];
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            plan
        });
    } catch (err) {
        console.error("Update Plan error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.removePlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const initialLength = user.plans.length;
        user.plans = user.plans.filter(p => p.planId !== planId);

        if (user.plans.length === initialLength) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Plan removed successfully"
        });
    } catch (err) {
        console.error("Remove Plan error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        res.status(200).json({
            success: true,
            plan
        });
    } catch (err) {
        console.error("Get Plan error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};