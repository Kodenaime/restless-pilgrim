// backend/src/models/ContactMessage.js
import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    ]
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isReplied: {
    type: Boolean,
    default: false
  }
});

// Create indexes for better query performance
contactMessageSchema.index({ sentAt: -1 });
contactMessageSchema.index({ isRead: 1 });
contactMessageSchema.index({ email: 1 });

export default mongoose.model('ContactMessage', contactMessageSchema);