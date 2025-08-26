const prisma = require('../prisma');

const showFolderForm = (req, res) => {
	res.render('newFolder');
};

const createFolder = async (req, res) => {
	const parentId = req.params.id ? Number(req.params.id) : null;
	const { folderName } = req.body;
	await prisma.node.create({
		data: {
			type: 'FOLDER',
			name: folderName,
			parentId: parentId,
		},
	});
	res.redirect('/dashboard');
};

const showContents = async (req, res) => {
	const folderId = Number(req.params.id);
	try {
		const folder = await prisma.node.findFirst({
			where: {
				id: folderId,
				type: 'FOLDER',
			},
		});
		const fileChildren = await prisma.node.findMany({
			where: {
				parentId: folderId,
				type: 'FILE',
			},
		});

		const folderChildren = await prisma.node.findMany({
			where: {
				parentId: folderId,
				type: 'FOLDER',
			},
		});
		res.render('folder', {
			folder,
			fileChildren,
			folderChildren,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	showContents,
	showFolderForm,
	createFolder,
};
