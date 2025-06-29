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
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  coverImage: {
    type: String, // Base64 encoded string
    trim: true
  },
  coverImageType: {
    type: String, // MIME type (e.g., 'image/jpeg')
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual property to get the image URL
bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage && this.coverImageType) {
    return `data:${this.coverImageType};base64,${this.coverImage}`;
  }
  return null;
});

// Create indexes for better query performance
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ createdAt: -1 });

export default mongoose.model('Book', bookSchema);