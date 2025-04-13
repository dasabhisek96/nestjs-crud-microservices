import Joi from 'joi';

/**
 * User validation schema using Joi
 * @module userValidator
 */
export const createUserValidator = Joi.object({
    name: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        })
});

export const updateUserValidator = Joi.object({
    name: Joi.string()
        .min(2)
        .optional()
        .messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name must be at least 2 characters long',
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Invalid email format',
        }),

    password: Joi.string()
        .min(6)
        .optional()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
        })
});