const express = require('express');
const router = express.Router();
const TaxFiling = require('../models/taxFiling.model.js');
const auth = require('../middleware/auth.js');

// @route   POST /api/tax/start-filing
// @desc    Start a new tax filing
// @access  Private
router.post('/start-filing', auth, async (req, res) => {
    try {
        const { itrFormType } = req.body;
        
        const existingFiling = await TaxFiling.findOne({
            user: req.userId,
            assessmentYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
        });

        if (existingFiling) {
            return res.status(400).json({ message: 'Filing for this year already exists' });
        }

        const taxFiling = new TaxFiling({
            user: req.userId,
            itrFormType: itrFormType || 'ITR-1'
        });

        await taxFiling.save();
        res.status(201).json(taxFiling);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

// @route   GET /api/tax/my-filings
// @desc    Get user's tax filings
// @access  Private
router.get('/my-filings', auth, async (req, res) => {
    try {
        const filings = await TaxFiling.find({ user: req.userId })
            .sort({ createdAt: -1 });
        res.json(filings);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

// @route   PUT /api/tax/update-filing/:id
// @desc    Update tax filing data
// @access  Private
router.put('/update-filing/:id', auth, async (req, res) => {
    try {
        const filing = await TaxFiling.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!filing) {
            return res.status(404).json({ message: 'Filing not found' });
        }

        // Update filing data
        const updatedFiling = await TaxFiling.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedFiling);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

module.exports = router;