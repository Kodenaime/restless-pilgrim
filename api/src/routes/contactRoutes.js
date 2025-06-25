
import express from 'express';
import { sendMessage } from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact/send
// @desc    Send contact message
// @access  Public
router.post('/send', sendMessage);

export default router;