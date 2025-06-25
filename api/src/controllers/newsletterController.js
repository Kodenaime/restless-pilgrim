
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Full name and email are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscriber
    const subscriber = await NewsletterSubscriber.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim()
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        id: subscriber._id,
        fullName: subscriber.fullName,
        email: subscriber.email,
        subscribedAt: subscriber.createdAt
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again later.'
    });
  }
};