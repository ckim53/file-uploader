const prisma = require('../config/prisma');

const showFolderForm = (req, res) => {
	const parentId = req.params.id ? Number(req.params.id) : null;
	const uploadAction = parentId
		? `/dashboard/folders/${parentId}/new-folder`
		: '/dashboard/new-folder';
	res.render('new-folder', { uploadAction });
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
	parentId
		? res.redirect(`/dashboard/folders/${parentId}`)
		: res.redirect('/dashboard');
};

const deleteFolder = async (req, res) => {
	const parentId = req.params.id ? Number(req.params.id) : null;
	const folder = await prisma.node.findFirst({
		where: {
			id: parentId,
			type: 'FOLDER',
		},
	});
	await prisma.node.delete({
		where: {
			id: parentId,
			type: 'FOLDER',
		},
	});
	folder.parentId
		? res.redirect(`/dashboard/folders/${folder.parentId}`)
		: res.redirect('/dashboard');
};

const editFolder = async (req, res, next) => {
	try {
		const folderId = Number(req.params.id);
		const newName = req.body.name;

		await prisma.node.update({
			where: { id: folderId },
			data: { name: newName },
		});

		res.redirect(`/dashboard/folders/${folderId}`);
	} catch (err) {
		next(err);
	}
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
			parentId: folder.parentId
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createFolder,
	deleteFolder,
	editFolder,
	showContents,
	showFolderForm,
};
