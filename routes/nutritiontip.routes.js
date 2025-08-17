const express = require('express');
const router = express.Router();
const {
    getRandomTip,
    getRandomFact
} = require('../controllers/nutritiontip.controller');

// Public routes
router.get('/random-tip', getRandomTip);
router.get('/random-fact', getRandomFact);

module.exports = router; 