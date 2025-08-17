const Joi = require('joi');

const analysisRequestSchema = Joi.object({
    period: Joi.string()
        .valid('1day', '3days', 'week', '2weeks', 'month')
        .required()
});

module.exports = {
    analysisRequestSchema
}; 