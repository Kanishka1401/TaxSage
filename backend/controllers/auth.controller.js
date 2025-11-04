const User = require('../models/user.model.js');
const CA = require('../models/ca.model.js');
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

// @desc    Register a new CA
// @route   POST /api/auth/ca/register
const registerCA = async (req, res) => {
    try {
        const {
            name,
            email,
            icaiNumber,
            password,
            specialization,
            yearsOfExperience,
            location,
            languages,
            availability,
            consultationFee,
            description,
            contact,
            services
        } = req.body;

        // Validate required fields
        if (!name || !email || !icaiNumber || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Check if CA already exists
        const caExists = await CA.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { icaiNumber }
            ]
        });

        if (caExists) {
            return res.status(400).json({ 
                message: caExists.email === email.toLowerCase() 
                    ? 'Email already registered' 
                    : 'ICAI number already registered' 
            });
        }

        // Create a new CA account
        const ca = await CA.create({
            name,
            email: email.toLowerCase(),
            icaiNumber,
            password,
            specialization,
            yearsOfExperience,
            location,
            languages,
            availability,
            consultationFee,
            description,
            contact,
            services,
            ratings: [],
            reviews: [],
            clients: []
        });

        if (ca) {
            res.status(201).json({
                _id: ca._id,
                name: ca.name,
                email: ca.email,
                icaiNumber: ca.icaiNumber,
                specialization: ca.specialization,
                token: generateToken(ca._id)
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
// @route   POST /api/auth/ca/login
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
                specialization: ca.specialization,
                type: 'ca'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    registerCA, 
    loginCA 
};