const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, deletedAt: null },
      select: { id: true, role: true, status: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
}

async function adminMiddleware(req, res, next) {
  await authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    next();
  });
}

function approvedMiddleware(req, res, next) {
  if (req.user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for admin review.',
    });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware, approvedMiddleware };
