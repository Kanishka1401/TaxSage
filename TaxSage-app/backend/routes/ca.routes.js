const express = require('express');
const router = express.Router();

// Controllers
const { findCAs, updateCAProfile, getCADashboard } = require('../controllers/ca.controller.js');

// Auth middleware
const { protect } = require('../middleware/auth.js');

// @route   GET /api/ca/search
// @desc    Search for CAs based on criteria
// @access  Private
router.get('/search', protect, findCAs);

// @route   PUT /api/ca/profile
// @desc    Update CA profile
// @access  Private (CA only)
router.put('/profile', protect, updateCAProfile);

// @route   GET /api/ca/dashboard
// @desc    Get CA dashboard data
// @access  Private (CA only)
router.get('/dashboard', protect, getCADashboard);

module.exports = router;
