import Joi from 'joi';
import _ from 'lodash';
import AppError from '../utils/appError';
import pino from 'pino';
const logger = pino({ name: 'UserValidator', level: 'error' });


export const userValidator = {
    validateCreateUser(data: any) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error, value } = schema.validate(data);
        if (error) {
            logger.error('Validation Error:', error.details[0].message);
            throw new AppError(error.details[0].message, 400);
        }
        return value;
    },

    validateUpdateUser(data: any) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
        });

        const { error, value } = schema.validate(data);
        if (error) {
            logger.error('Validation Error:', error.details[0].message);
            throw new AppError(error.details[0].message, 400);
        }
        return value;
    },
};

export const userValidatore = {
    isEmpty(data: any) {
        return _.isEmpty(data);
    },
};