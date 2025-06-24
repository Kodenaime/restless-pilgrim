// backend/src/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
    trim: true
  },
  coverImageUrl: {
    type: String,
    required: [true, 'Cover image URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ createdAt: -1 });

export default mongoose.model('Book', bookSchema);