const Joi = require('joi');

// Validator for adding a product
const addProductValidator = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().required(),
    category: Joi.string().min(3).max(30).required(),
    stock: Joi.number().integer().min(0).required(),
});

// Validator for updating the stock of an existing product
const updateStockValidator = Joi.object({
    productId: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
});

module.exports = {
    addProductValidator,
    updateStockValidator,
};