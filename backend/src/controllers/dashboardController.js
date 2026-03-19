const prisma = require('../utils/prisma');
const { calculateTechnicalScore } = require('../utils/scoring');

async function getDashboard(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        volunteerProfile: true,
        chemicalProfile: true,
        applications: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                category: true,
                complexityLevel: true,
                description: true,
              },
            },
          },
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        certificates: {
          where: { deletedAt: null },
          orderBy: { issuedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get available projects
    const projects = await prisma.project.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    let technicalScore = null;
    if (user.chemicalProfile) {
      technicalScore = calculateTechnicalScore(user.chemicalProfile, projects);
    }

    const unreadCount = user.notifications.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          role: user.role,
          joinedAt: user.createdAt,
          volunteerProfile: user.volunteerProfile,
          chemicalProfile: user.chemicalProfile,
        },
        applications: user.applications,
        projects,
        notifications: user.notifications,
        unreadNotifications: unreadCount,
        certificates: user.certificates,
        technicalScore,
        stats: {
          totalApplications: user.applications.length,
          approvedApplications: user.applications.filter(
            (a) => a.status === 'approved'
          ).length,
          pendingApplications: user.applications.filter(
            (a) => a.status === 'pending'
          ).length,
          certificates: user.certificates.length,
        },
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id, userId: req.user.id },
      data: { isRead: true },
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { getDashboard, markNotificationRead };
