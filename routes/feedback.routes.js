const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { submitFeedback } = require('../controllers/feedback.controller');

router.post('/', auth, submitFeedback);

module.exports = router; 