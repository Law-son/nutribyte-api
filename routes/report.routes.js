const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { reportRequestSchema } = require('../validations/report.validation');
const {
    generateReport,
    getReportByPeriod,
    getAllReports,
    getComparativeReport
} = require('../controllers/report.controller');

router.use(auth);

router.post('/generate', validate(reportRequestSchema), generateReport);
router.get('/period/:period', getReportByPeriod);
router.get('/compare', getComparativeReport);
router.get('/', getAllReports);

module.exports = router; 