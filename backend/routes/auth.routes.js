const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    registerCA, 
    loginCA 
} = require('../controllers/auth.controller.js');

// User routes
// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// CA routes
// @route   POST api/auth/ca/register
// @desc    Register a new CA
// @access  Public
router.post('/ca/register', registerCA);

// @route   POST api/auth/ca/login
// @desc    Authenticate CA & get token
// @access  Public
router.post('/ca/login', loginCA);

module.exports = router;