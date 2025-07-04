import Book from '../models/Book.js';

// Maximum image size (2MB)
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

// @desc    Create new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedDate, isbn, price } = req.body;

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }

    let coverImage = null;
    let coverImageType = null;

    // Process cover image if provided
    if (req.file) {
      // Check file size
      if (req.file.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({
          success: false,
          message: 'Cover image must be less than 2MB'
        });
      }

      // Convert buffer to base64
      coverImage = req.file.buffer.toString('base64');
      coverImageType = req.file.mimetype;
    }

    // Create book document
    const book = await Book.create({
      title,
      author,
      description,
      publishedDate,
      isbn,
      price: price ? parseFloat(price) : 0,
      coverImage,
      coverImageType,
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
    if (req.query.title) {
      filter.title = new RegExp(req.query.title, 'i');
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

    // Direct mapping now that virtuals are included
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
      data: book // Virtual will be included automatically
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

    const { title, author, description, publishedDate, isbn, price } = req.body;

    // Update text fields
    const updateData = {
      title: title || book.title,
      author: author || book.author,
      description: description || book.description,
      publishedDate: publishedDate || book.publishedDate,
      isbn: isbn || book.isbn,
      price: price ? parseFloat(price) : book.price
    };

    // Process cover image if provided
    if (req.file) {
      // Check file size
      if (req.file.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({
          success: false,
          message: 'Cover image must be less than 2MB'
        });
      }

      // Convert buffer to base64
      updateData.coverImage = req.file.buffer.toString('base64');
      updateData.coverImageType = req.file.mimetype;
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('user', 'name');

    // Convert to plain object and add coverImagePath
    const bookObject = book.toObject();
    if (book.coverImage) {
      bookObject.coverImagePath = book.coverImagePath;
    }

    res.json({
      success: true,
      data: bookObject
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