const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { register, login, logout } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', auth, logout);

module.exports = router; 