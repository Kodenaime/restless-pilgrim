
import Devotional from '../models/Devotional.js';
import mongoose from 'mongoose';

// @desc    Create a new devotional (Protected)
// @route   POST /api/devotionals
// @access  Protected (Admin only)
export const createDevotional = async (req, res) => {
  try {
    const {
      title,
      passage,
      shortDescription,
      content,
      coverImageUrl,
      publishDate
    } = req.body;

    // Validate required fields
    if (!title || !passage || !shortDescription || !content || !coverImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new devotional
    const devotional = new Devotional({
      title,
      passage,
      shortDescription,
      content,
      coverImageUrl,
      publishDate: publishDate || new Date()
    });

    const savedDevotional = await devotional.save();

    res.status(201).json({
      success: true,
      message: 'Devotional created successfully',
      devotional: savedDevotional
    });

  } catch (error) {
    console.error('Error creating devotional:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create devotional',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all devotionals (Public)
// @route   GET /api/devotionals
// @access  Public
export const getDevotionals = async (req, res) => {
  try {
    // Extract query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    // Optional: Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.publishDate = {};
      if (req.query.startDate) {
        filter.publishDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.publishDate.$lte = new Date(req.query.endDate);
      }
    }

    // Get devotionals with pagination, sorted by publishDate descending
    const devotionals = await Devotional.find(filter)
      .sort({ publishDate: -1 })
      .skip(skip)    
      .limit(limit);

    // Get total count for pagination info
    const total = await Devotional.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: devotionals.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      devotionals
    });

  } catch (error) {
    console.error('Error fetching devotionals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devotionals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single devotional by ID (Public)
// @route   GET /api/devotionals/:id
// @access  Public
export const getDevotionalById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid devotional ID format'
      });
    }

    const devotional = await Devotional.findById(id);

    if (!devotional) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    res.status(200).json({
      success: true,
      devotional
    });

  } catch (error) {
    console.error('Error fetching devotional:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devotional',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update devotional by ID (Protected)
// @route   PUT /api/devotionals/:id
// @access  Protected (Admin only)
export const updateDevotional = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid devotional ID format'
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;

    const devotional = await Devotional.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    if (!devotional) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Devotional updated successfully',
      devotional
    });

  } catch (error) {
    console.error('Error updating devotional:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update devotional',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete devotional by ID (Protected)
// @route   DELETE /api/devotionals/:id
// @access  Protected (Admin only)
export const deleteDevotional = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid devotional ID format'
      });
    }

    const devotional = await Devotional.findByIdAndDelete(id);

    if (!devotional) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Devotional deleted successfully',
      deletedDevotional: {
        _id: devotional._id,
        title: devotional.title
      }
    });

  } catch (error) {
    console.error('Error deleting devotional:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete devotional',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};