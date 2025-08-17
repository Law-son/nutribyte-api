const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { mealSchema } = require('../validations/meal.validation');
const { 
    getAllMeals,
    getMealsByCategory,
    searchMeals,
    createMeal,
    updateMeal,
    deleteMeal
} = require('../controllers/meal.controller');

// Public routes
router.get('/search', searchMeals);
router.get('/', getAllMeals);
router.get('/category/:category', getMealsByCategory);

// Protected routes
router.use(auth);
router.post('/', validate(mealSchema), createMeal);
router.put('/:id', validate(mealSchema), updateMeal);
router.delete('/:id', deleteMeal);

module.exports = router; 