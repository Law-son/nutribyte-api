const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // breakfast, lunch, etc.
        required: true,
    },
    ingredients: [String],
    nutrients: {
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
    imageURL: {
        type: String,
        default: ''
    },
}, { timestamps: true });

const mealModel = db.model('meal', mealSchema);

module.exports = mealModel;
