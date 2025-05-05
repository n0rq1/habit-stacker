const jwt = require('jsonwebtoken');
const User = require('../models/usersModel'); 
const { v4: uuidv4 } = require('uuid');

exports.createPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        const { planName, activities } = req.body;

        if (!planName) {
            return res.status(400).json({
                success: false,
                message: "Plan name must be provided!"
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
        const { planName } = req.body;

        // Check if planName is provided
        if (!planName || typeof planName !== 'string' || planName.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: "Plan name must be provided and cannot be empty" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the plan in the user's plans array
        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Check if a plan with the same name already exists
        const isDuplicate = user.plans.some(p => 
            p.planId !== planId && 
            p.planName.toLowerCase() === planName.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            return res.status(409).json({
                success: false,
                message: "A plan with this name already exists"
            });
        }

        plan.planName = planName.trim();

            
        await user.save();

        res.status(200).json({
            success: true,
            message: "Plan name updated successfully",
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