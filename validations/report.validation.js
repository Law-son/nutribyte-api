const Joi = require('joi');

const reportRequestSchema = Joi.object({
    period: Joi.string()
        .valid('1day', '3days', 'week', '2weeks', 'month')
        .required()
});

module.exports = {
    reportRequestSchema
}; 