const prisma = require('../utils/prisma');
const { readRegistrationFile, listRegistrationFiles } = require('../utils/fileGenerator');

// ── USERS ──────────────────────────────────────────────────────────────────────

async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          plainPassword: true,
          role: true,
          status: true,
          createdAt: true,
          volunteerProfile: {
            select: {
              city: true,
              fieldOfStudy: true,
              university: true,
              dateOfBirth: true,
              gender: true,
              educationLevel: true,
              skills: true,
              volunteerPreferences: true,
              motivationLetter: true
            },
          },
          chemicalProfile: {
            select: {
              specialization: true,
              softwareSkills: true,
              laboratorySkills: true,
              industrialSkills: true
            }
          },
          _count: { select: { applications: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, firstName: true, lastName: true, email: true, status: true },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId: id,
        title:
          status === 'approved'
            ? 'Application Approved!'
            : status === 'rejected'
              ? 'Application Update'
              : 'Status Changed',
        message:
          status === 'approved'
            ? 'Congratulations! Your volunteer application has been approved. You can now apply to projects.'
            : status === 'rejected'
              ? 'Unfortunately, your application was not approved at this time. Please contact us for more information.'
              : 'Your application status has been updated.',
      },
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // From authMiddleware

    if (id === adminId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hard delete - clean up all relations first
    await prisma.$transaction([
      prisma.volunteerProfile.deleteMany({ where: { userId: id } }),
      prisma.chemicalProfile.deleteMany({ where: { userId: id } }),
      prisma.application.deleteMany({ where: { userId: id } }),
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.certificate.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ── PROJECTS ───────────────────────────────────────────────────────────────────

async function getProjects(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { deletedAt: null },
        include: { _count: { select: { applications: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where: { deletedAt: null } }),
    ]);

    return res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function createProject(req, res) {
  try {
    const {
      title,
      titleAz,
      description,
      descriptionAz,
      location,
      locationAz,
      benefits,
      benefitsAz,
      requirements,
      requirementsAz,
      category,
      requiredSkills,
      requiredSoftware,
      safetyCertificationRequired,
      complexityLevel,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required',
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        titleAz,
        description,
        descriptionAz,
        location,
        locationAz,
        benefits,
        benefitsAz,
        requirements,
        requirementsAz,
        category,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
        requiredSoftware: Array.isArray(requiredSoftware) ? requiredSoftware : [],
        safetyCertificationRequired: !!safetyCertificationRequired,
        complexityLevel: complexityLevel || 'medium',
      },
    });

    return res.status(201).json({ success: true, project });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ── APPLICATIONS ──────────────────────────────────────────────────────────────

async function getApplications(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      deletedAt: null,
      ...(status && { status }),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
          project: { select: { id: true, title: true, category: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.count({ where }),
    ]);

    return res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true } },
        project: { select: { title: true } },
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: application.user.id,
        title: `Application ${status === 'approved' ? 'Approved' : 'Updated'}`,
        message: `Your application for "${application.project.title}" has been ${status}.`,
      },
    });

    return res.json({ success: true, application });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ── STATS ──────────────────────────────────────────────────────────────────────

async function getStats(req, res) {
  try {
    const [totalUsers, pendingUsers, approvedUsers, totalProjects, totalApplications, files] =
      await Promise.all([
        prisma.user.count({ where: { deletedAt: null, role: 'volunteer' } }),
        prisma.user.count({ where: { deletedAt: null, status: 'pending', role: 'volunteer' } }),
        prisma.user.count({ where: { deletedAt: null, status: 'approved', role: 'volunteer' } }),
        prisma.project.count({ where: { deletedAt: null, isActive: true } }),
        prisma.application.count({ where: { deletedAt: null } }),
        Promise.resolve(listRegistrationFiles()),
      ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        totalProjects,
        totalApplications,
        registrationFiles: files.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ── FILE DOWNLOAD ─────────────────────────────────────────────────────────────

async function listRegistrationTxtFiles(req, res) {
  try {
    const files = listRegistrationFiles();
    return res.json({ success: true, files });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function downloadRegistrationFile(req, res) {
  try {
    const { fileName } = req.params;
    const content = readRegistrationFile(fileName);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(content);
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
}

module.exports = {
  getUsers,
  updateUserStatus,
  deleteUser,
  getProjects,
  createProject,
  deleteProject,
  getApplications,
  updateApplicationStatus,
  getStats,
  listRegistrationTxtFiles,
  downloadRegistrationFile,
};
