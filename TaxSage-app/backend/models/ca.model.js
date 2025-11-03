const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const caSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    icaiNumber: {
        type: String,
        required: [true, 'ICAI Number is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    specialization: {
        type: [String],
        enum: [
            'Income Tax', 'GST', 'Corporate Law', 'Audit', 
            'Business Advisory', 'Tax Planning', 
            'Wealth Management', 'Startup Taxation'
        ],
        default: ['Income Tax']
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
        required: [true, 'Years of experience is required'],
        default: 0
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    languages: {
        type: [String],
        required: [true, 'Languages are required'],
        default: ['English']
    },
    availability: {
        type: String,
        enum: ['Available', 'Busy', 'Not Available'],
        default: 'Available'
    },
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Professional description is required'],
        trim: true
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    services: {
        type: [String],
        required: [true, 'Services offered are required']
    },
    qualifications: {
        type: [String],
        default: ['CA']
    },
    fees: {
        consultationFee: {
            type: Number,
            default: 0
        },
        filingFee: {
            type: Number,
            default: 0
        }
    },
    rating: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    responseTime: {
        type: String,
        default: 'Within 24 hours'
    },
    bio: {
        type: String,
        maxLength: 500,
        default: ''
    }
}, {
    timestamps: true
});

// Hash password only if it's modified or new
caSchema.pre('save', async function(next) {
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
caSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
caSchema.methods.toJSON = function() {
    const ca = this.toObject();
    delete ca.password;
    return ca;
};

const CA = mongoose.model('CA', caSchema);

module.exports = CA;
