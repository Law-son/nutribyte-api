const Joi = require('joi');

const profileSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(1).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    height: Joi.number().positive().required(), // in meters
    weight: Joi.number().positive().required(), // in kg
    activenessLevel: Joi.string().valid('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active').required(),
    healthConditions: Joi.array().items(Joi.string()),
    healthGoals: Joi.array().items(Joi.string())
});

module.exports = {
    profileSchema
}; 