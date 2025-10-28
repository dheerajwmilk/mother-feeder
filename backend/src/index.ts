import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables early so config files using process.env work
dotenv.config();
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import caretakerRoutes from './routes/caretakerRoutes';
// import infoRoutes from './routes/infoRoutes'
import corsOptions from './config/cors';

// Create Express app
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonest')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NeoNest API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/caretaker', caretakerRoutes);
// app.use('/v1/info/', infoRoutes);  

import { errorHandler } from './middleware/errorHandler';

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});