import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB.js';
import initWebRoutes from './routes/web.js';

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.URL_REACT || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Body parser configuration for large base64 image payloads (50mb limit)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize API routes
initWebRoutes(app);

// Connect to Database
connectDB();

// Global Express 5 Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong inside the server!',
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`BookingCare API is running on port: ${port}`);
});

export default app;
