const Joi = require('joi');

const mealLogSchema = Joi.object({
    date: Joi.date().iso().required(),
    mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
    meals: Joi.array().items(
        Joi.object({
            mealId: Joi.string().required(),
            portionSize: Joi.number().positive().required(),
            portionSizeUnit: Joi.string().valid('g', 'kg', 'ml', 'l').required()
        })
    ).min(1).required()
});

module.exports = {
    mealLogSchema
}; 