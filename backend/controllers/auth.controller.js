const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate a secure token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { firstName, lastName, pan, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if PAN already exists
        const panExists = await User.findOne({ pan });
        if (panExists) {
            return res.status(400).json({ message: 'PAN number already registered' });
        }

        // Create new user - password will be automatically hashed by the pre-save hook
        const user = await User.create({
            firstName,
            lastName,
            pan: pan.toUpperCase(),
            email: email.toLowerCase(),
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                pan: user.pan,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            if (error.keyPattern.pan) {
                return res.status(400).json({ message: 'PAN number already registered' });
            }
        }
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user by email (case insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                pan: user.pan,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Initiate email-only login (magic link)
// @route   POST /api/auth/email-login
const emailLogin = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // For now, we'll simulate sending a magic link
        // In production, you would:
        // 1. Generate a secure token for magic link
        // 2. Send email with the magic link
        // 3. Create another endpoint to verify the magic link token
        
        console.log(`Magic link login requested for: ${email}`);
        
        res.json({ 
            success: true, 
            message: 'If an account exists with this email, you will receive login instructions shortly.' 
        });
        
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { registerUser, loginUser, emailLogin };