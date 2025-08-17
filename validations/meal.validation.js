const Joi = require('joi');

const mealSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    nutrients: Joi.object({
        calories: Joi.number().min(0).required(),
        protein: Joi.number().min(0).required(),
        fat: Joi.number().min(0).required(),
        carbs: Joi.number().min(0).required(),
        fiber: Joi.number().min(0).required(),
        sugar: Joi.number().min(0).required(),
        sodium: Joi.number().min(0).required(),
        calcium: Joi.number().min(0).required(),
        iron: Joi.number().min(0).required(),
        potassium: Joi.number().min(0).required(),
        vitaminC: Joi.number().min(0).required()
    }).required(),
    imageURL: Joi.string().uri().allow('')
});

module.exports = {
    mealSchema
}; 