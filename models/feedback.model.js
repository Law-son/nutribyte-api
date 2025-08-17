const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Anonymous feedback allowed
    },
    type: {
        type: String,
        enum: ['general', 'meal_suggestion'],
        default: 'general',
        required: true
    },
    // For meal suggestions
    name: {
        type: String,
        required: function() { return this.type === 'meal_suggestion'; }
    },
    ingredients: {
        type: [String],
        required: false
    },
    origin: {
        type: String,
        required: false
    },
    // For general feedback
    message: {
        type: String,
        required: function() { return this.type === 'general'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema); 