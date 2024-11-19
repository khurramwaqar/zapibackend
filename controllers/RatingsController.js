const Ratings = require('../models/Ratings'); // Adjust the path as necessary

// Create a new rating
exports.createRatings = async (req, res) => {
    try {
        const { userId, seriesId, rate, comments } = req.body;

        // Basic validation
        if (!seriesId || !userId || !rate || !comments) {
            return res.status(400).json({ error: 'Missing seriesId, userId, rate, or comments' });
        }

        // Validate that rate is within range (if defined in the model as 1-5)
        if (rate < 1 || rate > 5) {
            return res.status(400).json({ error: 'Rate must be between 1 and 5' });
        }

        const ratings = new Ratings({ userId, seriesId, rate, comments });
        await ratings.save();

        res.status(201).json({ message: 'Rating added successfully', ratings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all favorites for a user
exports.getRatingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // const ratings = await Ratings.find({ userId }).populate('seriesId');
        const ratings = await Ratings.find({ userId }).select('userId seriesId rate comments addedAt');
        res.status(200).json(ratings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all ratings for a user based on a specific series
exports.getRatingsByUserSeriesBased = async (req, res) => {
    try {
        const { userId, seriesId } = req.params;

        // Find ratings by userId and seriesId without populating series data
        const ratings = await Ratings.find({ userId, seriesId }).select('userId seriesId rate comments addedAt');

        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a specific favorite by ID
exports.getRatingsById = async (req, res) => {
    try {
        const { id } = req.params;
        const ratings = await Ratings.findById(id).populate('seriesId');
        if (!ratings) {
            return res.status(404).json({ message: 'Ratings not found' });
        }
        res.status(200).json(ratings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a favorite
exports.updateRatings = async (req, res) => {
    try {
        const { id } = req.params;
        const { seriesId } = req.body;
        const ratings = await Ratings.findByIdAndUpdate(
            id,
            { seriesId },
            { new: true }
        );
        if (!ratings) {
            return res.status(404).json({ message: 'Ratings not found' });
        }
        res.status(200).json({ message: 'Ratings updated successfully', ratings });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a favorite
exports.deleteRatings = async (req, res) => {
    try {
        const { id } = req.params;
        const ratings = await Ratings.findByIdAndDelete(id);
        if (!ratings) {
            return res.status(404).json({ message: 'Ratings not found' });
        }
        res.status(200).json({ message: 'Ratings deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.toggleRatings = async (req, res) => {
    try {
        const { userId, seriesId } = req.body;

        if (seriesId && userId) {
            // Check if the favorite already exists
            let ratings = await Ratings.findOne({ userId, seriesId });

            if (ratings) {
                // If it exists, delete it
                await Ratings.findByIdAndDelete(ratings._id);
                return res.status(200).json({ message: 'Ratings removed successfully' });
            } else {
                // If it does not exist, create it
                ratings = new Ratings({ userId, seriesId });
                await ratings.save();
                return res.status(201).json({ message: 'Ratings added successfully', ratings });
            }
        } else {
            res.status(400).json({ error: 'Series ID not found' });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};