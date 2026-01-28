import express from 'express';
import { generateContent } from '../controllers/aiController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-content', generateContent);

export default router;
