const prisma = require('../utils/prisma');

async function applyToProject(req, res) {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    if (req.user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account must be approved before applying to projects.',
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null, isActive: true },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const existing = await prisma.application.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this project',
      });
    }

    const application = await prisma.application.create({
      data: { userId, projectId, status: 'pending' },
      include: { project: { select: { title: true } } },
    });

    return res.status(201).json({
      success: true,
      message: `Successfully applied to "${application.project.title}"`,
      application,
    });
  } catch (err) {
    console.error('Apply error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getMyApplications(req, res) {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id, deletedAt: null },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: applications });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { applyToProject, getMyApplications };
