const CA = require('../models/ca.model.js');
const TaxFiling = require('../models/taxFiling.model.js');

// Find CAs based on search criteria
exports.findCAs = async (req, res) => {
    try {
        const { 
            specialization, 
            experience, 
            location, 
            maxFee, 
            languages,
            rating,
            services 
        } = req.query;
        
        let query = { isVerified: true };

        if (specialization && specialization !== 'All Specializations') {
            query.specialization = { $in: [specialization] };
        }
        if (experience) {
            query.yearsOfExperience = { $gte: parseInt(experience) };
        }
        if (location && location !== 'All Locations') {
            query.location = location;
        }
        if (maxFee) {
            query.consultationFee = { $lte: parseInt(maxFee) };
        }
        if (languages) {
            query.languages = { $in: Array.isArray(languages) ? languages : [languages] };
        }
        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }
        if (services) {
            query.services = { $in: Array.isArray(services) ? services : [services] };
        }

        const cas = await CA.find(query)
            .select('-password -clients')
            .sort({ rating: -1, reviews: -1 })
            .lean();
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// Update CA profile
exports.updateCAProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Don't allow password updates through this route

        const ca = await CA.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!ca) {
            return res.status(404).json({ message: 'CA not found' });
        }

        res.json(ca);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// Get CA dashboard data
exports.getCADashboard = async (req, res) => {
    try {
        const ca = await CA.findById(req.userId)
            .populate('clients', 'name email')
            .select('-password');

        if (!ca) {
            return res.status(404).json({ message: 'CA not found' });
        }

        // Get recent tax filings for clients
        const recentFilings = await TaxFiling.find({
            user: { $in: ca.clients },
            status: { $ne: 'completed' }
        })
        .populate('user', 'name email')
        .sort('-updatedAt')
        .limit(10);

        // Calculate dashboard statistics
        const stats = {
            totalClients: ca.clients.length,
            pendingReviews: recentFilings.filter(f => f.status === 'pending_review').length,
            inProgress: recentFilings.filter(f => f.status === 'in_progress').length,
            completed: recentFilings.filter(f => f.status === 'completed').length
        };

        res.json({
            caProfile: ca,
            recentFilings,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};