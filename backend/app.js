import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import securitySetup from './middleware/securityMiddleware.js';
import maintenanceMiddleware from './middleware/maintenanceMiddleware.js';

// --- ROUTE IMPORTS ---
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import customerAdminRoutes from './routes/customerAdminRoutes.js'; 
import couponRoutes from './routes/couponRoutes.js'; 
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import giftCardRoutes from './routes/giftCardRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); 

// Load credentials (Standard config for Render environment variables)
dotenv.config();

// Initialize Database (Uses MONGO_URI from process.env)
connectDB();

const app = express();

// --- MIDDLEWARE ---

// Security Layer (Helmet, RateLimit, Sanitize)
securitySetup(app);

// CORS Policy (Uses FRONTEND_URL from process.env)
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if in allowed list
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body Parsers (Increased limits for high-res images/descriptions)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Maintenance Check (Uses maintenance credentials in DB/Settings)
app.use(maintenanceMiddleware);

// --- API ROUTES ---

app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin/customers', customerAdminRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/collections', collectionRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/store/recommendations', recommendationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/admin/system', systemRoutes);
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin/homepage', homepageRoutes);
app.use('/api/store/cart', cartRoutes);
app.use('/api/store/checkout', checkoutRoutes);

// Health Check Endpoint (For Render/Vercel monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// --- STATIC ASSETS & PRODUCTION ---

// Redirect SEO files to dynamic generation
app.get('/sitemap.xml', (req, res) => res.redirect('/api/seo/sitemap.xml'));
app.get('/robots.txt', (req, res) => res.redirect('/api/seo/robots.txt'));

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(rootDir, 'dist');
  app.use(express.static(distPath));
  
  // SPA Fallback: Any route not handled by API goes to index.html
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
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 CORS allowed for: ${allowedOrigins.join(', ')}`);
  console.log(`📂 Environment variables injected and active`);
});

export default app;