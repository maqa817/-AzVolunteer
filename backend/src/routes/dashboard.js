const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDashboard, markNotificationRead } = require('../controllers/dashboardController');

router.get('/', authMiddleware, getDashboard);
router.patch('/notifications/:id/read', authMiddleware, markNotificationRead);

module.exports = router;
