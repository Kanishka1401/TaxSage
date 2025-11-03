const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    pan: {
        type: String,
        required: [true, 'PAN number is required'],
        unique: true,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    // ADD THIS: User type to distinguish between user and CA
    userType: {
        type: String,
        enum: ['user', 'ca'],
        default: 'user'
    },
    // ADD THIS: CA-specific fields (only for userType: 'ca')
    caDetails: {
        experience: {
            type: String,
            required: function() { return this.userType === 'ca'; }
        },
        specialization: {
            type: String,
            required: function() { return this.userType === 'ca'; }
        },
        qualifications: [{
            type: String
        }],
        services: [{
            type: String
        }],
        location: {
            type: String,
            required: function() { return this.userType === 'ca'; }
        },
        consultationFee: {
            type: Number
        },
        bio: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            default: 0
        },
        reviews: [{
            clientName: String,
            rating: Number,
            comment: String,
            date: { type: Date, default: Date.now }
        }]
    },
    assignedCA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Now references the same User model
    },
    taxFilings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaxFiling'
    }]
}, {
    timestamps: true
});

// Hash password only if it's modified or new
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;