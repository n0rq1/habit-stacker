const Joi = require('joi');

exports.signupSchema = Joi.object({
    username: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must be at most 15 characters'
    }),
    email: Joi.string()
        .min(6)
        .max(40)
        .required()
        .email({
            tlds: { allow: ['com', 'net', 'edu'] },
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
});

exports.signinSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net', 'edu'] },
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
});

exports.habitSchema = Joi.object({
    habitID: Joi.number().integer().required(),
    habitName: Joi.string().min(3).max(40).required(),
    habitDescription: Joi.string().allow('').max(255),
    habitImage: Joi.string().required(),

    startTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // HH:MM 24hr format
        .required()
        .messages({
            'string.pattern.base': 'Start time must be in HH:MM format'
        }),

    endTime: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .custom((value, helpers) => {
            const start = helpers.state.ancestors[0].startTime;
            if (start && value <= start) {
                return helpers.message('End time must be after start time');
            }
            return value;
        }),

    daysOfWeek: Joi.array().items(
        Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    ).min(1).required(),

    isPublish: Joi.boolean().optional()
});
