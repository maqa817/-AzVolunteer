const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectDetails } = require('../controllers/projectsController');

router.get('/', getAllProjects);
router.get('/:id', getProjectDetails);

module.exports = router;
