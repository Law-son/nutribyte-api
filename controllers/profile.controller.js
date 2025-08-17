const UserProfile = require('../models/profile.model');

const getProfile = async (req, res, next) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user.userId });
        
        if (!profile) {
            const error = new Error('Profile not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const createProfile = async (req, res, next) => {
    try {
        // Check if profile already exists
        const existingProfile = await UserProfile.findOne({ userId: req.user.userId });
        if (existingProfile) {
            const error = new Error('Profile already exists');
            error.statusCode = 400;
            throw error;
        }

        const profile = new UserProfile({
            userId: req.user.userId,
            ...req.body
        });

        await profile.save();

        res.status(201).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!profile) {
            const error = new Error('Profile not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    createProfile,
    updateProfile
}; 