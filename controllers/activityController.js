const jwt = require('jsonwebtoken');
const User = require('../models/usersModel'); 
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

const generateDatesForRestOfYear = (startDateStr) => {
    const startDate = dayjs(startDateStr);
    const endOfYear = dayjs().endOf('year');
    const dayOfWeek = startDate.day();
    
    const dates = [];
    let currentDate = startDate;
    
    // Add the start date itself
    dates.push(startDate.format('YYYY-MM-DD'));
    
    // Move to the next week
    currentDate = currentDate.add(7, 'day');
    
    // Add dates for each week until the end of year
    while (currentDate.isBefore(endOfYear) || currentDate.isSame(endOfYear, 'day')) {
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(7, 'day');
    }
    
    return dates;
  };

  exports.addActivity = async (req, res) => {
    try {
        const { userId, planId } = req.params;
        const { habitId, date, time, timeOfDay, repeat } = req.body;
        console.log("Received repeat parameter:", repeat);


        // Validate required fields
        if (!habitId || !date || !time || !timeOfDay) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: habitId, date, time, timeOfDay"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the plan
        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Find the habit
        const habit = user.habits.find(h => h.habitId === habitId);
        if (!habit) {
            return res.status(404).json({ success: false, message: "Habit not found" });
        }

        // Check if we need to repeat for the rest of the year
        let datesToAdd = [date];
        if (repeat) {
            datesToAdd = generateDatesForRestOfYear(date);
            console.log(`Repeating activity for ${datesToAdd.length} dates`);
        }

        // Check if there's an activity with the same habit
        const sameHabitActivityIndex = plan.activities.findIndex(activity => 
            activity.habit.habitId === habitId
        );

        // If we found an activity with the same habit, add to it
        if (sameHabitActivityIndex !== -1) {
            const activity = plan.activities[sameHabitActivityIndex];
            
            // Add each date in the datesToAdd array
            for (const dateToAdd of datesToAdd) {
                // Check if this date already exists for this activity and time slot
                const existingDateIndex = activity.dates.findIndex((d, i) => 
                    d === dateToAdd && activity.timeOfDay[i] === timeOfDay
                );
                
                if (existingDateIndex === -1) {
                    // Date doesn't exist, so add it
                    activity.dates.push(dateToAdd);
                    activity.times.push(time);
                    activity.timeOfDay.push(timeOfDay);
                    activity.status.push(false); // Default status is not completed
                }
            }
        } else {
            // Create new activity
            const newActivity = {
                habit: {
                    habitId: habit.habitId,
                    habitName: habit.habitName,
                    habitDescription: habit.habitDescription,
                    habitImage: habit.habitImage
                },
                dates: [],
                times: [],
                timeOfDay: [],
                status: []
            };
            
            // Add each date to the new activity
            for (const dateToAdd of datesToAdd) {
                newActivity.dates.push(dateToAdd);
                newActivity.times.push(time);
                newActivity.timeOfDay.push(timeOfDay);
                newActivity.status.push(false);
            }

            plan.activities.push(newActivity);
        }

        await user.save();

        res.status(201).json({
            success: true,
            message: "Activity added successfully",
            plan
        });

    } catch (err) {
        console.error("Add Activity error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update the updateActivity function to handle repeat parameter
exports.updateActivity = async (req, res) => {
    try {
        const { userId, planId, habitId, dateIndex } = req.params;
        const { time, timeOfDay, repeat } = req.body;

        const dateIndexNumber = parseInt(dateIndex);
        if (isNaN(dateIndexNumber)) {
            return res.status(400).json({
                success: false,
                message: "dateIndex must be a valid number"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the plan
        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Find the activity with the specified habit
        const activity = plan.activities.find(a => a.habit.habitId === habitId);
        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Check if dateIndex is valid
        if (dateIndexNumber < 0 || dateIndexNumber >= activity.dates.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid dateIndex"
            });
        }

        // Update the activity details for the specified date
        if (time !== undefined) {
            activity.times[dateIndexNumber] = time;
        }
        
        if (timeOfDay !== undefined) {
            activity.timeOfDay[dateIndexNumber] = timeOfDay;
        }

        // If repeat is enabled, add this activity for the same day of week for the rest of the year
        if (repeat) {
            const currentDate = activity.dates[dateIndexNumber];
            const futureDates = generateDatesForRestOfYear(currentDate).slice(1); // Skip the first one since it's the current date
            
            // Add each future date to this activity
            for (const futureDate of futureDates) {
                // Check if this date already exists for this activity and time slot
                const existingDateIndex = activity.dates.findIndex((d, i) => 
                    d === futureDate && activity.timeOfDay[i] === timeOfDay
                );
                
                if (existingDateIndex === -1) {
                    // Date doesn't exist, so add it
                    activity.dates.push(futureDate);
                    activity.times.push(time || activity.times[dateIndexNumber]); // Use the updated time or the current time
                    activity.timeOfDay.push(timeOfDay || activity.timeOfDay[dateIndexNumber]); // Use the updated timeOfDay or the current one
                    activity.status.push(false); // Default status is not completed
                }
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Activity updated successfully",
            activity
        });

    } catch (err) {
        console.error("Update Activity error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const { userId, planId, habitId, dateIndex } = req.params;

        const dateIndexNumber = parseInt(dateIndex);
        if (isNaN(dateIndexNumber)) {
            return res.status(400).json({
                success: false,
                message: "dateIndex must be a valid number"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the plan
        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Find the activity index
        const activityIndex = plan.activities.findIndex(a => a.habit.habitId === habitId);
        if (activityIndex === -1) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const activity = plan.activities[activityIndex];

        // Check if dateIndex is valid
        if (dateIndexNumber < 0 || dateIndexNumber >= activity.dates.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid dateIndex"
            });
        }

        // If this is the only date for this activity, remove the entire activity
        if (activity.dates.length === 1) {
            plan.activities.splice(activityIndex, 1);
        } else {
            // Otherwise, just remove this specific date
            activity.dates.splice(dateIndexNumber, 1);
            activity.times.splice(dateIndexNumber, 1);
            activity.timeOfDay.splice(dateIndexNumber, 1);
            activity.status.splice(dateIndexNumber, 1);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully"
        });

    } catch (err) {
        console.error("Delete Activity error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Toggle activity completion status
exports.toggleActivityStatus = async (req, res) => {
    try {
        const { userId, planId, habitId, dateIndex } = req.params;

        const dateIndexNumber = parseInt(dateIndex);
        if (isNaN(dateIndexNumber)) {
            return res.status(400).json({
                success: false,
                message: "dateIndex must be a valid number"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the plan
        const plan = user.plans.find(p => p.planId === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Find the activity
        const activity = plan.activities.find(a => a.habit.habitId === habitId);
        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Check if dateIndex is valid
        if (dateIndexNumber < 0 || dateIndexNumber >= activity.dates.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid dateIndex"
            });
        }

        // Toggle the status
        activity.status[dateIndexNumber] = !activity.status[dateIndexNumber];

        await user.save();

        res.status(200).json({
            success: true,
            message: "Activity status toggled successfully",
            status: activity.status[dateIndexNumber]
        });

    } catch (err) {
        console.error("Toggle Activity Status error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};