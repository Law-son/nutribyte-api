const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { analysisRequestSchema } = require('../validations/analysis.validation');
const {
    requestAnalysis,
    getAnalysisByPeriod,
    getAllAnalyses,
    getDailyBreakdown,
    debugMealLogs,
    testMealData
} = require('../controllers/analysis.controller');

router.use(auth);

router.post('/request', validate(analysisRequestSchema), requestAnalysis);
router.get('/period/:period', getAnalysisByPeriod);
router.get('/', getAllAnalyses);
router.get('/daily', getDailyBreakdown);
router.get('/debug/meals', debugMealLogs);
router.get('/test/meals', testMealData);

module.exports = router; 