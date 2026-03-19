const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middleware/auth');
const {
  getUsers,
  updateUserStatus,
  getProjects,
  createProject,
  deleteProject,
  getApplications,
  updateApplicationStatus,
  getStats,
  listRegistrationTxtFiles,
  downloadRegistrationFile,
  deleteUser,
} = require('../controllers/adminController');

// Stats
router.get('/stats', adminMiddleware, getStats);

// Users
router.get('/users', adminMiddleware, getUsers);
router.patch('/users/:id/status', adminMiddleware, updateUserStatus);
router.delete('/users/:id', adminMiddleware, deleteUser);

// Projects
router.get('/projects', adminMiddleware, getProjects);
router.post('/projects', adminMiddleware, createProject);
router.delete('/projects/:id', adminMiddleware, deleteProject);

// Applications
router.get('/applications', adminMiddleware, getApplications);
router.patch('/applications/:id/status', adminMiddleware, updateApplicationStatus);

// Registration files
router.get('/files', adminMiddleware, listRegistrationTxtFiles);
router.get('/files/:fileName', adminMiddleware, downloadRegistrationFile);

module.exports = router;
