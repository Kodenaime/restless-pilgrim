
import Book from '../models/Book.js';
import { bucket } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

// Helper function to upload file to Firebase Storage
const uploadFileToFirebase = async (file, folder) => {
  if (!file) return null;

  const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    public: true,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', async () => {
      try {
        // Make the file public
        await fileUpload.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve({ fileName, publicUrl });
      } catch (error) {
        reject(error);
      }
    });

    stream.end(file.buffer);
  });
};

// Helper function to delete file from Firebase Storage
const deleteFileFromFirebase = async (fileName) => {
  if (!fileName) return;
  
  try {
    await bucket.file(fileName).delete();
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedDate, isbn, price } = req.body;

    // Check if book with same title and author already exists
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this title and author already exists'
      });
    }

    let coverImageUrl = null;
    let bookPdfUrl = null;
    let coverImageFileName = null;
    let bookPdfFileName = null;

    // Upload cover image if provided
    if (req.files && req.files.coverImage) {
      const coverResult = await uploadFileToFirebase(req.files.coverImage[0], 'book-covers');
      coverImageUrl = coverResult.publicUrl;
      coverImageFileName = coverResult.fileName;
    }

    // Upload book PDF if provided
    if (req.files && req.files.bookPdf) {
      const pdfResult = await uploadFileToFirebase(req.files.bookPdf[0], 'book-pdfs');
      bookPdfUrl = pdfResult.publicUrl;
      bookPdfFileName = pdfResult.fileName;
    }

    // Create book document
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      publishedDate,
      isbn,
      price: price ? parseFloat(price) : 0,
      coverImage: coverImageUrl,
      bookPdf: bookPdfUrl,
      coverImageFileName,
      bookPdfFileName,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.genre) {
      filter.genre = new RegExp(req.query.genre, 'i');
    }
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, 'i');
    }
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { author: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') }
      ];
    }

    const books = await Book.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('user', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check user ownership
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    const { title, author, description, genre, publishedDate, isbn, price } = req.body;
    
    // Store old file names for potential deletion
    const oldCoverImageFileName = book.coverImageFileName;
    const oldBookPdfFileName = book.bookPdfFileName;

    // Update text fields
    const updateData = {
      title: title || book.title,
      author: author || book.author,
      description: description || book.description,
      genre: genre || book.genre,
      publishedDate: publishedDate || book.publishedDate,
      isbn: isbn || book.isbn,
      price: price ? parseFloat(price) : book.price
    };

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      const coverResult = await uploadFileToFirebase(req.files.coverImage[0], 'book-covers');
      updateData.coverImage = coverResult.publicUrl;
      updateData.coverImageFileName = coverResult.fileName;
      
      // Delete old cover image
      if (oldCoverImageFileName) {
        await deleteFileFromFirebase(oldCoverImageFileName);
      }
    }

    // Handle book PDF upload
    if (req.files && req.files.bookPdf) {
      const pdfResult = await uploadFileToFirebase(req.files.bookPdf[0], 'book-pdfs');
      updateData.bookPdf = pdfResult.publicUrl;
      updateData.bookPdfFileName = pdfResult.fileName;
      
      // Delete old PDF
      if (oldBookPdfFileName) {
        await deleteFileFromFirebase(oldBookPdfFileName);
      }
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('user', 'name');

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check user ownership
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    // Delete files from Firebase Storage
    if (book.coverImageFileName) {
      await deleteFileFromFirebase(book.coverImageFileName);
    }
    if (book.bookPdfFileName) {
      await deleteFileFromFirebase(book.bookPdfFileName);
    }

    // Delete book from database
    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};