import Joi from 'joi';

const commonString = (max: number) => Joi.string().max(max);
const optionalDate = () => Joi.date().optional();

export const userValidatorSchema = Joi.object({
    id: Joi.string().uuid().optional(),
    name: commonString(100).required(),
    email: commonString(100).email().required(),
    password: Joi.string().min(8).required(),
    createdAt: optionalDate(),
    updatedAt: optionalDate(),
});