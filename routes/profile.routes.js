const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { profileSchema } = require('../validations/profile.validation');
const { getProfile, createProfile, updateProfile } = require('../controllers/profile.controller');

router.use(auth); // Protect all profile routes

router.get('/', getProfile);
router.post('/', validate(profileSchema), createProfile);
router.put('/', validate(profileSchema), updateProfile);

module.exports = router; 