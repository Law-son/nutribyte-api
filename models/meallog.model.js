const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const mealLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mealType: {
        type: String, // 'breakfast', 'lunch', etc.
        required: true
    },
    meals: [{
        mealId: {
            type: Schema.Types.ObjectId,
            ref: 'meal',
            required: true
        },
        portionSize: {
            type: Number,
            default: 1
        },
        portionSizeUnit: {
            type: String,
            enum: ['g (grams)', 'l (litres)', 'cup', 'piece', 'ladle', 'bowl (small)', 'bowl (medium)', 'bowl (large)', 'ball'],
            default: 'g (grams)'
        }
    }]
}, { timestamps: true });

const mealLogModel = db.model('mealLog', mealLogSchema);

module.exports = mealLogModel;
// This model represents a user's meal log, which includes the user ID, date, meal type, and an array of meals consumed with their portion sizes.