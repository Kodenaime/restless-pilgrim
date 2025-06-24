
import mongoose from 'mongoose';

const devotionalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Devotional title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  passage: {
    type: String,
    required: [true, 'Scripture passage is required'],
    trim: true,
    maxlength: [100, 'Passage reference cannot exceed 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  coverImageUrl: {
    type: String,
    required: [true, 'Cover image URL is required'],
    trim: true
  },
  publishDate: {
    type: Date,
    required: [true, 'Publish date is required'],
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create indexes for better query performance
devotionalSchema.index({ publishDate: -1 });
devotionalSchema.index({ title: 1 });
devotionalSchema.index({ createdAt: -1 });

export default mongoose.model('Devotional', devotionalSchema);