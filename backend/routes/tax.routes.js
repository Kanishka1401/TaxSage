const express = require('express');
const router = express.Router();
const TaxFiling = require('../models/taxFiling.model.js');
const auth = require('../middleware/auth.js');

// Import controller functions directly
const {
    saveTaxFiling,
    getTaxFiling,
    inviteCA,
    getFilingForReview,
    submitCAReview
} = require('../controllers/tax.controller.js');

// ------------------------------------------------------------------
// @route   POST /api/tax/start-filing
// @desc    Start a new tax filing
// @access  Private
// ------------------------------------------------------------------
router.post('/start-filing', auth, async (req, res) => {
    try {
        const { itrFormType } = req.body;
        const year = new Date().getFullYear();
        const assessmentYear = `${year}-${year + 1}`;

        const existingFiling = await TaxFiling.findOne({ user: req.userId, assessmentYear });
        if (existingFiling) {
            return res.status(400).json({ message: 'Filing for this year already exists' });
        }

        const taxFiling = new TaxFiling({
            user: req.userId,
            itrFormType: itrFormType || 'ITR-1',
            assessmentYear
        });

        await taxFiling.save();
        res.status(201).json(taxFiling);
    } catch (error) {
        console.error('Error creating filing:', error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

// ------------------------------------------------------------------
// @route   GET /api/tax/my-filings
// @desc    Get user's tax filings
// @access  Private
// ------------------------------------------------------------------
router.get('/my-filings', auth, async (req, res) => {
    try {
        const filings = await TaxFiling.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(filings);
    } catch (error) {
        console.error('Error fetching filings:', error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

// ------------------------------------------------------------------
// @route   PUT /api/tax/update-filing/:id
// @desc    Update tax filing data
// @access  Private
// ------------------------------------------------------------------
router.put('/update-filing/:id', auth, async (req, res) => {
    try {
        const filing = await TaxFiling.findOne({ _id: req.params.id, user: req.userId });
        if (!filing) {
            return res.status(404).json({ message: 'Filing not found' });
        }

        const updatedFiling = await TaxFiling.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedFiling);
    } catch (error) {
        console.error('Error updating filing:', error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

// ------------------------------------------------------------------
// @route   PUT /api/tax/filing
// @desc    Save tax filing data
// @access  Private
// ------------------------------------------------------------------
router.put('/filing', auth, saveTaxFiling);

// ------------------------------------------------------------------
// @route   GET /api/tax/filing
// @desc    Get tax filing data
// @access  Private
// ------------------------------------------------------------------
router.get('/filing', auth, getTaxFiling);

// ------------------------------------------------------------------
// @route   POST /api/tax/:id/invite-ca
// @desc    Invite a CA to review a filing (user)
// @access  Private
// ------------------------------------------------------------------
router.post('/:id/invite-ca', auth, inviteCA);

// ------------------------------------------------------------------
// @route   GET /api/tax/review/:id
// @desc    Get filing details for CA review
// @access  Private (CA)
// ------------------------------------------------------------------
router.get('/review/:id', auth, getFilingForReview);

// ------------------------------------------------------------------
// @route   POST /api/tax/review/:id
// @desc    CA submits review (comments and action)
// @access  Private (CA)
// ------------------------------------------------------------------
router.post('/review/:id', auth, submitCAReview);

module.exports = router;