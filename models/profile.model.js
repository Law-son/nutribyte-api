const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const userProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: String,
    age: Number,
    gender: String,
    height: Number, // m
    weight: Number, // kg
    activenessLevel: String, 
    weightGoal: {
        type: String,
        enum: ['lose', 'maintain', 'gain'],
        default: 'maintain'
    },
    healthConditions: [String],
    healthGoals: [String],
}, { timestamps: true });

const userProfileModel = db.model('userProfile', userProfileSchema);

module.exports = userProfileModel;
