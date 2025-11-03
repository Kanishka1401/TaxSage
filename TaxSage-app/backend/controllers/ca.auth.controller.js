const CA = require('../models/ca.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate a secure token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new CA
// @route   POST /api/ca/auth/register
const registerCA = async (req, res) => {
    const { name, email, icaiNumber, password } = req.body;

    try {
        // Check if CA already exists
        const caExists = await CA.findOne({ email });
        if (caExists) {
            return res.status(400).json({ message: 'CA already exists with this email' });
        }

        // Check if ICAI number already exists
        const icaiExists = await CA.findOne({ icaiNumber });
        if (icaiExists) {
            return res.status(400).json({ message: 'ICAI number already registered' });
        }

        // Create new CA - password will be automatically hashed by the pre-save hook
        const ca = await CA.create({
            name,
            email: email.toLowerCase(),
            icaiNumber,
            password, // Password will be hashed automatically in the model
        });

        if (ca) {
            res.status(201).json({
                _id: ca._id,
                name: ca.name,
                email: ca.email,
                icaiNumber: ca.icaiNumber,
                token: generateToken(ca._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid CA data' });
        }
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            if (error.keyPattern.icaiNumber) {
                return res.status(400).json({ message: 'ICAI number already registered' });
            }
        }
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Authenticate CA & get token (Login)
// @route   POST /api/ca/auth/login
const loginCA = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for CA by email (case insensitive)
        const ca = await CA.findOne({ email: email.toLowerCase() });

        if (ca && (await ca.matchPassword(password))) {
            res.json({
                _id: ca._id,
                name: ca.name,
                email: ca.email,
                icaiNumber: ca.icaiNumber,
                token: generateToken(ca._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { registerCA, loginCA };