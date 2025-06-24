
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required :true,
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create indexes for better query performance
//adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });

// Handle duplicate email error
adminSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('An admin with this email address already exists'));
  } else {
    next(error);
  }
});

export default mongoose.model('Admin', adminSchema);