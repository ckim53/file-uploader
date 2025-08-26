const prisma = require('../prisma');

const showUploadForm = (req, res) => {
	const folderId = req.params.id || null;
	const uploadAction = folderId
		? `/dashboard/folders/${folderId}/upload`
		: '/dashboard/upload';

	res.render('upload', { success: req.flash('success'), uploadAction });
};

const createFile = async (req, res) => {
	const parentId = req.params.id ? Number(req.params.id) : null;
	const folderId = req.params.id || null;
	const uploadAction = folderId
		? `/dashboard/folders/${folderId}/upload`
		: '/dashboard/upload';
	await prisma.node.create({
		data: {
			type: 'FILE',
			name: req.file.originalname,
			parentId: parentId,
			contentType: req.file.mimetype,
			size: req.file.size,
			path: req.file.path,
		},
	});
	req.flash('success', 'File Uploaded!');
	parentId
		? res.redirect(`/dashboard/folders/${folderId}`)
		: res.redirect('/dashboard');
};

const showFileDetails = async (req, res) => {
	try {
		const fileId = Number(req.params.id);
		const file = await prisma.node.findFirst({
			where: {
				id: fileId,
				type: 'FILE',
			},
		});
		res.render('file', { file });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	showFileDetails,
	showUploadForm,
	createFile,
};
