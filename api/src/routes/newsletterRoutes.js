
import express from 'express';
import { subscribe } from '../controllers/newsletterController.js';

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', subscribe);

export default router;