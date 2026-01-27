
const maintenanceMiddleware = (req, res, next) => {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  if (isMaintenance && !req.path.startsWith('/api/admin')) {
    return res.status(503).json({ message: 'Store is under maintenance. Please try again later.' });
  }
  next();
};

export default maintenanceMiddleware;
