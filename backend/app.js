import dotenv from 'dotenv';
// Load environment variables immediately before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import securitySetup from './middleware/securityMiddleware.js';
import maintenanceMiddleware from './middleware/maintenanceMiddleware.js';

// Route Imports
import mediaRoutes from './routes/mediaRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); 

// Initialize Database
connectDB();

const app = express();

// --- MIDDLEWARE ---
securitySetup(app);

// Flexible CORS for development and production
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(maintenanceMiddleware);

// --- API ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date(), environment: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/ai', aiRoutes);

// --- STATIC ASSETS & PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(rootDir, 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
       return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;