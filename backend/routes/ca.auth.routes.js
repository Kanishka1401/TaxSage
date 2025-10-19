const express = require('express');
const router = express.Router();
const { registerCA, loginCA } = require('../controllers/ca.auth.controller.js');

// @route   POST api/ca/auth/register
// @desc    Register a new CA
// @access  Public
router.post('/register', registerCA);

// @route   POST api/ca/auth/login
// @desc    Authenticate CA & get token
// @access  Public
router.post('/login', loginCA);

module.exports = router;