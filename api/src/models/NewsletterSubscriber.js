// backend/src/models/NewsletterSubscriber.js
import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create indexes for better query performance
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ subscribedAt: -1 });
newsletterSubscriberSchema.index({ isActive: 1 });

// Handle duplicate email error
newsletterSubscriberSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email address is already subscribed to our newsletter'));
  } else {
    next(error);
  }
});

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);