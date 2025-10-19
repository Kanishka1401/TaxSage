const mongoose = require('mongoose');

const taxFilingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentYear: {
        type: String,
        required: true,
        default: () => {
            const year = new Date().getFullYear();
            return `${year}-${year + 1}`;
        }
    },
    itrFormType: {
        type: String,
        enum: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'],
        default: 'ITR-1'
    },
    status: {
        type: String,
        enum: ['draft', 'pending_review', 'action_required', 'approved', 'filed'],
        default: 'draft'
    },
    
    // Personal Information
    personalInfo: {
        firstName: String,
        lastName: String,
        pan: String,
        dateOfBirth: Date,
        phone: String,
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        }
    },
    
    // Income Details
    income: {
        salary: {
            basicSalary: { type: Number, default: 0 },
            allowances: { type: Number, default: 0 },
            perquisites: { type: Number, default: 0 },
            profitsInLie: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        houseProperty: {
            annualValue: { type: Number, default: 0 },
            interest: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        otherSources: {
            interest: { type: Number, default: 0 },
            dividend: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        totalIncome: { type: Number, default: 0 }
    },
    
    // Deductions
    deductions: {
        section80C: { type: Number, default: 0 },
        section80D: { type: Number, default: 0 },
        section80G: { type: Number, default: 0 },
        section24: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    
    // Tax Calculation
    taxCalculation: {
        grossTotalIncome: { type: Number, default: 0 },
        totalDeductions: { type: Number, default: 0 },
        taxableIncome: { type: Number, default: 0 },
        taxPayable: { type: Number, default: 0 },
        taxPaid: { type: Number, default: 0 },
        refund: { type: Number, default: 0 }
    },
    
    // CA Review
    caReview: {
        ca: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CA'
        },
        comments: [{
            section: String,
            comment: String,
            createdAt: { type: Date, default: Date.now },
            resolved: { type: Boolean, default: false }
        }],
        reviewedAt: Date
    },
    
    // Documents
    documents: [{
        name: String,
        type: String, // Form16, InvestmentProof, etc.
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('TaxFiling', taxFilingSchema);