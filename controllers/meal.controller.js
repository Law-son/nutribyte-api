const Meal = require('../models/meal.model');

const getAllMeals = async (req, res, next) => {
    try {
        const meals = await Meal.find();
        res.json({
            success: true,
            data: meals
        });
    } catch (error) {
        next(error);
    }
};

const getMealsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const meals = await Meal.find({ category });
        res.json({
            success: true,
            data: meals
        });
    } catch (error) {
        next(error);
    }
};

const searchMeals = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json({
                success: true,
                data: []
            });
        }

        const meals = await Meal.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { ingredients: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json({
            success: true,
            data: meals
        });
    } catch (error) {
        next(error);
    }
};

const createMeal = async (req, res, next) => {
    try {
        const meal = new Meal(req.body);
        await meal.save();

        res.status(201).json({
            success: true,
            data: meal
        });
    } catch (error) {
        next(error);
    }
};

const updateMeal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const meal = await Meal.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!meal) {
            const error = new Error('Meal not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: meal
        });
    } catch (error) {
        next(error);
    }
};

const deleteMeal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const meal = await Meal.findByIdAndDelete(id);

        if (!meal) {
            const error = new Error('Meal not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMeals,
    getMealsByCategory,
    searchMeals,
    createMeal,
    updateMeal,
    deleteMeal
}; 