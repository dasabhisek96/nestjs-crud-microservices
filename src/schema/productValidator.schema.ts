import Joi from 'joi';
const commonString = (min: number, max: number) =>
    Joi.string().min(min).max(max);

const positiveNumber = () =>
    Joi.number().min(0);

const optionalString = (max: number) =>
    Joi.string().optional().max(max);

export const productValidatorSchemaRefactored = Joi.object({
    name: commonString(3, 100).required().messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 3 characters long',
        'string.max': 'Product name must not exceed 100 characters',
    }),
    price: positiveNumber().required().messages({
        'number.base': 'Price must be a valid number',
        'number.empty': 'Price is required',
        'number.min': 'Price must be a positive number',
    }),
    description: optionalString(500).messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 500 characters',
    }),
    stock: positiveNumber().integer().required().messages({
        'number.base': 'Stock must be a valid number',
        'number.empty': 'Stock is required',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
    }),
});