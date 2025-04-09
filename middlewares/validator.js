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
        .max(35)
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