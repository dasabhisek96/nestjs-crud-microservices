import Joi from 'joi';
import _ from 'lodash';
import AppError from '../utils/appError';
import pino from 'pino';

const logger = pino({ name: 'ProductValidator', level: 'error' });

export const productValidator = {
    validateCreateProduct(data: any) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required(),
            price: Joi.number().positive().required(),
            description: Joi.string().max(500).optional(),
            category: Joi.string().min(3).max(30).required(),
            stock: Joi.number().integer().min(0).required(),
        });

        const { error, value } = schema.validate(data);
        if (error) {
            logger.error('Validation Error:', error.details[0].message);
            throw new AppError(error.details[0].message, 400);
        }
        return value;
    },

    validateUpdateProduct(data: any) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).optional(),
            price: Joi.number().positive().optional(),
            description: Joi.string().max(500).optional(),
            category: Joi.string().min(3).max(30).optional(),
            stock: Joi.number().integer().min(0).optional(),
        });

        const { error, value } = schema.validate(data);
        if (error) {
            logger.error('Validation Error:', error.details[0].message);
            throw new AppError(error.details[0].message, 400);
        }
        return value;
    },
};

export const productValidatorUtils = {
    isEmpty(data: any) {
        return _.isEmpty(data);
    },
};