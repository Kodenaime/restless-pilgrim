// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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