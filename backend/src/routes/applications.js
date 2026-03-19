const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { applyToProject, getMyApplications } = require('../controllers/applicationController');

router.post('/', authMiddleware, applyToProject);
router.get('/my', authMiddleware, getMyApplications);

module.exports = router;
