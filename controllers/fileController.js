const prisma = require('../config/prisma');
const { cloudinary } = require('../config/cloudinary');

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
			url: req.file.path,
			cloudinaryId: req.file.filename,
		},
	});
	req.flash('success', 'File Uploaded!');
	parentId
		? res.redirect(`/dashboard/folders/${folderId}`)
		: res.redirect('/dashboard');
};

const deleteFile = async (req, res) => {
	const fileId = req.params.id ? Number(req.params.id) : null;
	const file = await prisma.node.findFirst({
		where: {
			id: fileId,
			type: 'FILE',
		},
	});

	if (file.cloudinaryId) {
		await cloudinary.uploader.destroy(file.cloudinaryId);
	}

	await prisma.node.delete({ where: { id: Number(fileId) } });
	const parentId = file.parentId;

	parentId
		? res.redirect(`/dashboard/folders/${parentId}`)
		: res.redirect('/dashboard');
};

const downloadFile = async (req, res) => {
	const fileId = Number(req.params.id);
	const file = await prisma.node.findFirst({
		where: { id: fileId, type: 'FILE' },
	});
	if (!file) return res.status(404).send('File not found');
	console.log(file.url);
	res.redirect(file.url);
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
	deleteFile,
	downloadFile,
	showFileDetails,
	showUploadForm,
};
