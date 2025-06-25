
import express from 'express';
import {
  createDevotional,
  getDevotionals,
  getDevotionalById,
  updateDevotional,
  deleteDevotional
} from '../controllers/devotionalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
// GET /api/devotionals - Get all devotionals (with pagination)
router.get('/', getDevotionals);

// GET /api/devotionals/:id - Get single devotional by ID
router.get('/:id', getDevotionalById);

// Protected routes (require admin authentication)
// POST /api/devotionals - Create new devotional
router.post('/', protect, createDevotional);

// PUT /api/devotionals/:id - Update devotional by ID
router.put('/:id', protect, updateDevotional);

// DELETE /api/devotionals/:id - Delete devotional by ID
router.delete('/:id', protect, deleteDevotional);

export default router;