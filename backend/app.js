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

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); 

// Initialize Database
connectDB();

const app = express();

// --- MIDDLEWARE ---
securitySetup(app);

// Flexible CORS for Vercel and local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://genius-site-v1-repo.onrender.com',
  'https://genius-site-v1-repo-28vizhbyr-zaynahspos-hashs-projects.vercel.app'
];

// Add origins from environment variable if provided
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => allowedOrigins.push(url.trim()));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      // Exact match or subdomain check
      return origin === allowed || (allowed.startsWith('https://') && origin.endsWith(allowed.replace('https://', '')));
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(maintenanceMiddleware);

// --- API ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

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