const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { mealLogSchema } = require('../validations/meallog.validation');
const {
    getMealLogs,
    getMealLogsByDate,
    getMealLogsByDateRange,
    createMealLog,
    updateMealLog,
    deleteMealLog
} = require('../controllers/meallog.controller');

router.use(auth);

router.get('/', getMealLogs);
router.get('/date/:date', getMealLogsByDate);
router.get('/range', getMealLogsByDateRange);
router.post('/', validate(mealLogSchema), createMealLog);
router.put('/:id', validate(mealLogSchema), updateMealLog);
router.delete('/:id', deleteMealLog);

module.exports = router; 