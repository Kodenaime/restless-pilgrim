
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import adminRoutes from './src/routes/adminRoutes.js'
import devotionalRoutes from './src/routes/devotionalRoutes.js'
import bookRoutes from './src/routes/bookRoutes.js'
import newsletterRoutes from './src/routes/newsletterRoutes.js'
import contactRoutes from './src/routes/contactRoutes.js'


const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,               // Allow cookies/tokens in requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization']       // Allowed headers
};

app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(express.json());

//Main Routes 
app.use('/api/admin', adminRoutes);
app.use('/api/devotionals', devotionalRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running and connected to MongoDB!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});