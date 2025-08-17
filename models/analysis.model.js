const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;
const userProfileModel = require('./profile.model');

const analysisSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date, 
        required: true
    },
    period: {
        type: String,
        enum: ['1day', '3days', 'week', '2weeks', 'month'],
        required: true
    },
    nutritionalStatus: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true
    },
    calorieGoal: {
        type: Number,
        required: true
    },
    currentCalorie: {
        type: Number,
        default: 0
    },
    goalAnalysis: {
        type: String,
        enum: ['You\'re meeting your goal', 'Not meeting your goal'],
        required: true
    },
    healthAnalysis: {
        type: String,
        enum: ['You\'re eating healthy', 'Not eating healthy'],
        required: true
    },
    analysis: {
        summary: String,
        recommendations: [String],
        nutritionalDeficiencies: [String],
        nutritionalExcesses: [String],
        healthRisks: [String],
        positivePoints: [String]
    },
    nutrientBreakdown: {
        calories: Number,
        protein: Number,
        fat: Number,
        carbs: Number,
        fiber: Number,
        sugar: Number,
        sodium: Number,
        calcium: Number,
        iron: Number,
        potassium: Number,
        vitaminC: Number
    }      
}, { timestamps: true });

// Method to calculate calorie goal based on user profile
analysisSchema.statics.calculateCalorieGoal = async function(userId) {
    const userProfile = await userProfileModel.findOne({ userId });
    if (!userProfile) {
        throw new Error('User profile not found');
    }

    // Convert height from meters to centimeters
    const heightInCm = userProfile.height * 100;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (userProfile.gender.toLowerCase() === 'male') {
        bmr = (10 * userProfile.weight) + (6.25 * heightInCm) - (5 * userProfile.age) + 5;
    } else {
        bmr = (10 * userProfile.weight) + (6.25 * heightInCm) - (5 * userProfile.age) - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'super active': 1.9
    };

    // Calculate TDEE
    const activityLevel = userProfile.activenessLevel.toLowerCase();
    const multiplier = activityMultipliers[activityLevel] || 1.2; // Default to sedentary if not found
    let calorieGoal = bmr * multiplier;

    // Adjust calorie goal based on weight goal
    const weightGoal = userProfile.weightGoal || 'maintain';
    switch (weightGoal) {
        case 'lose':
            calorieGoal -= 500; // Subtract 500 calories for weight loss
            break;
        case 'gain':
            calorieGoal += 500; // Add 500 calories for weight gain
            break;
        // 'maintain' case doesn't need any adjustment
    }

    return Math.round(calorieGoal);
};

const analysisModel = db.model('analysis', analysisSchema);

module.exports = analysisModel; 