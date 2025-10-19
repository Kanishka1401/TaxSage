const express = require('express');
const router = express.Router();
const { registerUser, loginUser, emailLogin } = require('../controllers/auth.controller.js');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST api/auth/email-login
// @desc    Initiate email-only login (magic link)
// @access  Public
router.post('/email-login', emailLogin);

module.exports = router;