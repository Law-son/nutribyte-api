const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const reportSchema = new Schema({
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
    mealLogs: [{
        type: Schema.Types.ObjectId,
        ref: 'mealLog'
    }],
    totalNutrients: {
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
    },
    dailyAverages: {
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
    },
    goalProgress: {
        calorieGoal: Number,
        recommendedNutrients: {
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
        },
        progress: {
            calories: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            protein: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            fat: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            carbs: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            fiber: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            sugar: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            sodium: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            calcium: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            iron: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            potassium: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            },
            vitaminC: {
                current: Number,
                recommended: Number,
                percentage: Number,
                status: String
            }
        }
    },
    trends: {
        previousPeriod: String,
        previousNutrients: {
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
        },
        trends: {
            calories: {
                change: Number,
                trend: String,
                direction: String
            },
            protein: {
                change: Number,
                trend: String,
                direction: String
            },
            fat: {
                change: Number,
                trend: String,
                direction: String
            },
            carbs: {
                change: Number,
                trend: String,
                direction: String
            },
            fiber: {
                change: Number,
                trend: String,
                direction: String
            },
            sugar: {
                change: Number,
                trend: String,
                direction: String
            },
            sodium: {
                change: Number,
                trend: String,
                direction: String
            },
            calcium: {
                change: Number,
                trend: String,
                direction: String
            },
            iron: {
                change: Number,
                trend: String,
                direction: String
            },
            potassium: {
                change: Number,
                trend: String,
                direction: String
            },
            vitaminC: {
                change: Number,
                trend: String,
                direction: String
            }
        }
    },
    analytics: {
        mostEatenMeal: String,
        leastEatenMeal: String,
        mealCounts: Schema.Types.Mixed,
        totalMeals: Number,
        averageMealsPerDay: Number
    },
    aiAnalysis: {
        summary: String,
        nutritionalAssessment: String,
        goalProgressInsights: String,
        trendInsights: String,
        personalizedRecommendations: [String],
        healthConditionAdvice: [String],
        actionItems: [String]
    },
    summary: {
        type: String,
        required: true
    },
    recommendations: [String],
    healthInsights: [String]
}, { timestamps: true });

const reportModel = db.model('report', reportSchema);

module.exports = reportModel; 