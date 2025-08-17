const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const nutritionTipSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'diet', 'nutrients', 'lifestyle', 'health'],
        default: 'general'
    },
    tags: [String]
}, { timestamps: true });

const nutritionTipModel = db.model('nutritionTip', nutritionTipSchema);

module.exports = nutritionTipModel; 