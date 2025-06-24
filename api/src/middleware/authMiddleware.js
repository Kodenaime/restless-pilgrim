
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Extract token from "Bearer [token]"
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin by ID from token payload
        const admin = await Admin.findById(decoded.adminId).select('-password');

        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Admin not found - authorization denied'
          });
        }

        // Check if admin is active
        if (!admin.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Admin account is inactive - authorization denied'
          });
        }

        // Attach admin to request object
        req.admin = admin;
        next();

      } catch (error) {
        console.error('Token verification error:', error);
        
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired - please login again'
          });
        } else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            message: 'Invalid token - authorization denied'
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Token verification failed - authorization denied'
          });
        }
      }
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided - authorization denied'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Middleware to check if admin has specific permissions (for future use)
export const adminOnly = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Optional: Middleware to get current admin info (for protected routes)
export const getCurrentAdmin = async (req, res) => {
  try {
    if (req.admin) {
      res.status(200).json({
        success: true,
        admin: {
          _id: req.admin._id,
          email: req.admin.email,
          createdAt: req.admin.createdAt,
          lastLogin: req.admin.lastLogin,
          isActive: req.admin.isActive
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};