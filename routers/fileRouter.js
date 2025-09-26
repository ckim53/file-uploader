const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/storage');

const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated && req.isAuthenticated()) return next();
	req.flash('error', 'Please log in to upload files.');
	return res.redirect('/');
};

fileRouter.get('/', ensureAuth, fileController.showUploadForm);
fileRouter.post(
	'/',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
fileRouter.get('/:id/details', ensureAuth, fileController.showFileDetails);
fileRouter.get('/:id/download', ensureAuth, fileController.downloadFile);
fileRouter.delete('/:id', ensureAuth, fileController.deleteFile);

module.exports = { fileRouter, ensureAuth };
