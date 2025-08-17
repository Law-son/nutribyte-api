const Feedback = require('../models/feedback.model');
const EmailServices = require('../services/email.service');
const UserProfile = require('../models/profile.model');

// POST /feedback
const submitFeedback = async (req, res) => {
    try {
        const { type, name, ingredients, origin, message } = req.body;
        const userId = req.user ? req.user.userId : undefined;

        // Validation: type must be present
        if (!type || !['general', 'meal_suggestion'].includes(type)) {
            return res.status(400).json({ success: false, error: { message: 'Invalid or missing feedback type.' } });
        }
        // For meal suggestions, name is required
        if (type === 'meal_suggestion' && !name) {
            return res.status(400).json({ success: false, error: { message: 'Meal name is required for meal suggestions.' } });
        }
        // For general feedback, message is required
        if (type === 'general' && !message) {
            return res.status(400).json({ success: false, error: { message: 'Message is required for general feedback.' } });
        }

        const feedback = new Feedback({
            userId,
            type,
            name,
            ingredients,
            origin,
            message
        });
        await feedback.save();

        // Prepare email to admin
        let senderName = 'Anonymous';
        if (userId) {
            const profile = await UserProfile.findOne({ userId });
            if (profile && profile.name) senderName = profile.name;
        }
        let subject = type === 'meal_suggestion' ? 'New Meal Suggestion' : 'New User Feedback';
        let emailMessage = '';
        if (type === 'meal_suggestion') {
            emailMessage = `Meal Name: ${name}\n` +
                (ingredients ? `Ingredients: ${ingredients.join(', ')}\n` : '') +
                (origin ? `Origin: ${origin}\n` : '');
        } else {
            emailMessage = `Message: ${message}`;
        }
        await EmailServices.sendEmail(
            'buabassahlawson@gmail.com',
            senderName,
            subject,
            emailMessage
        );

        res.status(201).json({ success: true, message: 'Feedback submitted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, error: { message: 'Failed to submit feedback.', stack: error.stack } });
    }
};

module.exports = { submitFeedback }; 