
import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';
import { protect, getCurrentAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
// POST /api/admin/register - Register a new admin
router.post('/register', registerAdmin);

// POST /api/admin/login - Login admin
router.post('/login', loginAdmin);

// Protected routes (require authentication)
// GET /api/admin/me - Get current admin info
router.get('/me', protect, getCurrentAdmin);
// Example of a protected route (for testing)
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to the admin dashboard, ${req.admin.email}!`,
    admin: {
      _id: req.admin._id,
      email: req.admin.email
    }
  });
});

export default router;