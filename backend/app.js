import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import securitySetup from './middleware/securityMiddleware.js';
import maintenanceMiddleware from './middleware/maintenanceMiddleware.js';
import User from './models/userModel.js'; // Import User for bootstrapping

// Route Imports
import mediaRoutes from './routes/mediaRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

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
// Automatically ensure the admin user exists on server start
const bootstrapAdmin = async () => {
    try {
        // Wait a moment for DB connection to be established
        setTimeout(async () => {
            const adminEmail = process.env.ADMIN_EMAIL || 'totvoguepk@gmail.com';
            const userCount = await User.countDocuments({ email: adminEmail });
            
            if (userCount === 0) {
                console.log(`⚡ Bootstrapping Admin User: ${adminEmail}`);
                await User.create({
                    name: 'Super Admin',
                    email: adminEmail,
                    password: 'my112233', // Default password
                    role: 'admin',
                    addresses: [],
                    wishlist: []
                });
                console.log('✅ Admin User Created Successfully. You can now login.');
            } else {
                console.log(`ℹ️ Admin User (${adminEmail}) detected.`);
            }
        }, 3000); // 3 second delay
    } catch (error) {
        console.error('Bootstrap Error:', error.message);
    }
};
bootstrapAdmin();

// --- API ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
      status: 'UP', 
      env: process.env.NODE_ENV 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/ai', aiRoutes);

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

// Global Error Safety
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