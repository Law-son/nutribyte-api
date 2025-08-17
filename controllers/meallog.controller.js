const MealLog = require('../models/meallog.model');

const getMealLogs = async (req, res, next) => {
    try {
        const mealLogs = await MealLog.find({ userId: req.user.userId })
            .populate('meals.mealId')
            .sort({ date: -1 });

        res.json({
            success: true,
            data: mealLogs
        });
    } catch (error) {
        next(error);
    }
};

const getMealLogsByDate = async (req, res, next) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const mealLogs = await MealLog.find({
            userId: req.user.userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('meals.mealId');

        res.json({
            success: true,
            data: mealLogs
        });
    } catch (error) {
        next(error);
    }
};

const getMealLogsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const mealLogs = await MealLog.find({
            userId: req.user.userId,
            date: {
                $gte: start,
                $lte: end
            }
        }).populate('meals.mealId')
          .sort({ date: 1 });

        res.json({
            success: true,
            data: mealLogs
        });
    } catch (error) {
        next(error);
    }
};

const createMealLog = async (req, res, next) => {
    try {
        const mealLog = new MealLog({
            userId: req.user.userId,
            ...req.body
        });

        await mealLog.save();
        await mealLog.populate('meals.mealId');

        res.status(201).json({
            success: true,
            data: mealLog
        });
    } catch (error) {
        next(error);
    }
};

const updateMealLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mealLog = await MealLog.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        ).populate('meals.mealId');

        if (!mealLog) {
            const error = new Error('Meal log not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: mealLog
        });
    } catch (error) {
        next(error);
    }
};

const deleteMealLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mealLog = await MealLog.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!mealLog) {
            const error = new Error('Meal log not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            message: 'Meal log deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMealLogs,
    getMealLogsByDate,
    getMealLogsByDateRange,
    createMealLog,
    updateMealLog,
    deleteMealLog
}; 