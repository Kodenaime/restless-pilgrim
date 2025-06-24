// server/models/Devotional.js
import mongoose from 'mongoose';

const devotionalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  scriptureReference: {
    type: String,
    required: true,
    trim: true
  },
  scriptureText: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
devotionalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
devotionalSchema.index({ date: -1 });
devotionalSchema.index({ isPublished: 1 });
devotionalSchema.index({ tags: 1 });

export default mongoose.model('Devotional', devotionalSchema);