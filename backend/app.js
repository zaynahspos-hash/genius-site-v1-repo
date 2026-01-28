import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; // Added for debug check
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import securitySetup from './middleware/securityMiddleware.js';
import maintenanceMiddleware from './middleware/maintenanceMiddleware.js';
import User from './models/userModel.js'; 

// Route Imports
import mediaRoutes from './routes/mediaRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); 

// Connect to Database
connectDB();

const app = express();

// --- SECURITY & CORS ---
securitySetup(app);

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(maintenanceMiddleware);

// --- LOGGING ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- BOOTSTRAP ADMIN USER ---
const bootstrapAdmin = async () => {
    try {
        setTimeout(async () => {
            const adminEmail = process.env.ADMIN_EMAIL || 'totvoguepk@gmail.com';
            const adminPassword = 'my112233'; 
            
            if (mongoose.connection.readyState !== 1) return; // Skip if DB not ready

            const user = await User.findOne({ email: adminEmail });
            
            if (!user) {
                console.log(`⚡ Bootstrapping Admin User: ${adminEmail}`);
                await User.create({
                    name: 'Super Admin',
                    email: adminEmail,
                    password: adminPassword,
                    role: 'admin',
                    addresses: [],
                    wishlist: []
                });
                console.log('✅ Admin User Created Successfully.');
            } else {
                // Ensure role is correct
                if (user.role !== 'admin') {
                    user.role = 'admin';
                    await user.save();
                }
            }
        }, 3000); 
    } catch (error) {
        console.error('Bootstrap Error:', error.message);
    }
};
bootstrapAdmin();

// --- API ROUTES ---

// Simple Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', env: process.env.NODE_ENV });
});

// Deep System Diagnostics Endpoint
app.get('/api/health/system', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };

    res.json({
        backend: 'Online',
        database: {
            status: dbStatusMap[dbState] || 'Unknown',
            connected: dbState === 1,
            host: mongoose.connection.host
        },
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_MONGO_URI: !!process.env.MONGO_URI,
            HAS_JWT_SECRET: !!process.env.JWT_SECRET,
            HAS_API_KEY: !!process.env.API_KEY, // Gemini
            HAS_CLOUDINARY: !!process.env.CLOUDINARY_CLOUD_NAME
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/ai', aiRoutes);
app.use('/api/products', productRoutes);

// --- PRODUCTION SERVING ---
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(rootDir, 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
       return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Server Error: Frontend build not found.");
        }
    });
  });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
    console.error(err.name, err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🔌 API accessible at http://localhost:${PORT}/api`);
});

export default app;