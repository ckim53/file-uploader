const prisma = require('../prisma');

const showDashboard = async (req, res, next) => {
	try {
		const folders = await prisma.node.findMany({
			where: {
				parentId: null,
				type: 'FOLDER',
			},
		});
		const files = await prisma.node.findMany({
			where: {
				parentId: null,
				type: 'FILE',
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
