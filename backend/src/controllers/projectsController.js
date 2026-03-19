const prisma = require('../utils/prisma');

async function getAllProjects(req, res) {
    try {
        const { category, complexity, search } = req.query;

        const where = {
            deletedAt: null,
            isActive: true,
            ...(category && { category }),
            ...(complexity && { complexityLevel: complexity }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { titleAz: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { descriptionAz: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                    { locationAz: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const projects = await prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return res.json({
            success: true,
            data: projects,
        });
    } catch (err) {
        console.error('getProjects error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getProjectDetails(req, res) {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id, deletedAt: null },
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.json({ success: true, data: project });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { getAllProjects, getProjectDetails };
