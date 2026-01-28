import express from 'express';
import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Helper to get settings instance (Singleton)
const getSettingsDoc = async () => {
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({});
    }
    return settings;
};

// Public: Get Settings
router.get('/', asyncHandler(async (req, res) => {
    const settings = await getSettingsDoc();
    res.json(settings);
}));

// Admin: Update Settings
router.put('/:section', protect, admin, asyncHandler(async (req, res) => {
    const { section } = req.params;
    let settings = await getSettingsDoc();

    if (section === 'all') {
        // Deep merge logic simplified for Mongoose
        Object.assign(settings, req.body);
    } else {
        // Update specific section
        settings[section] = { ...settings[section], ...req.body };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
}));

// --- Menus (Saved within Settings or separate model, simplified here inside Settings for now) ---
// Note: In a larger app, Menus might be a separate collection. For now, we stub or store in settings if schema allows.
// Since schema didn't explicitly define 'menus', let's mock it for now or rely on a generic field if we added `mixed`.
// We will return a static array or add it to schema later.
router.get('/menus', (req, res) => {
    res.json([
        { handle: 'main', title: 'Main Menu', items: [] },
        { handle: 'footer', title: 'Footer Menu', items: [] }
    ]);
});

router.post('/menus', protect, admin, (req, res) => {
    res.json({ message: 'Menu saved (Mock)' });
});

export default router;