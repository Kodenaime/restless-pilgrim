
import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Create multer instance with file size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images for cover and PDFs for books
    if (file.fieldname === 'coverImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Cover image must be an image file'), false);
      }
    } else if (file.fieldname === 'bookPdf') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Book file must be a PDF'), false);
      }
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
});

// Middleware function to handle file uploads
const uploadBookFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]);

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

export { uploadBookFiles, handleUploadError };