import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Create multer instance with file size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit (reduced from 50MB for base64)
    files: 1 // Only allow one file
  },
  fileFilter: (req, file, cb) => {
    // Only accept cover images
    if (file.fieldname === 'coverImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for cover'), false);
      }
    } else {
      cb(new Error('Unexpected field - only coverImage is allowed'), false);
    }
  }
});

// Middleware function to handle single file upload
const uploadCoverImage = upload.single('coverImage');

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Cover image too large. Maximum size is 2MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Only one file is allowed for cover image.'
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

export { uploadCoverImage, handleUploadError };