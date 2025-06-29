
import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCoverImage, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', protect, uploadCoverImage, handleUploadError, createBook);
router.put('/:id', protect, uploadCoverImage, handleUploadError, updateBook);
router.delete('/:id', protect, deleteBook);

export default router;