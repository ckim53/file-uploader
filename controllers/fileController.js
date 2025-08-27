const prisma = require('../prisma');
const path = require('path');
const uploadsDir = path.resolve(__dirname, '../uploads');

const downloadFile = async (req, res, next) => {
	try {
		const fileId = Number(req.params.id);
		const file = await prisma.node.findFirst({
			where: { id: fileId, type: 'FILE' },
		});
		if (!file) return res.status(404).send('File not found');
		const absolutePath = path.resolve(uploadsDir, path.basename(file.path));

		if (!absolutePath.startsWith(uploadsDir)) {
			return res.status(403).send('Invalid file path');
		}

		res.download(absolutePath, file.name);
	} catch (err) {
		next(err);
	}
};

const createFile = async (req, res) => {
	const parentId = req.params.id ? Number(req.params.id) : null;
	const folderId = req.params.id || null;

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

const showUploadForm = (req, res) => {
	const folderId = req.params.id || null;
	const uploadAction = folderId
		? `/dashboard/folders/${folderId}/upload`
		: '/dashboard/upload';

	res.render('upload', { success: req.flash('success'), uploadAction });
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
	createFile,
	downloadFile,
	showFileDetails,
	showUploadForm,
};
