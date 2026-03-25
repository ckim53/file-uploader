const prisma = require('../config/prisma');

const showDashboard = async (req, res, next) => {
	try {
		const folders = await prisma.node.findMany({
			where: {
				parentId: null,
				type: 'FOLDER',
				userId: req.user.id
			},
		});
		const files = await prisma.node.findMany({
			where: {
				parentId: null,
				type: 'FILE',
				userId: req.user.id
			},
		});
		res.render('dashboard', {
			folders,
			files,
			uploadAction: '/dashboard/upload',
		});
	} catch (err) {
		return next(err);
	}
};

module.exports = { showDashboard };
