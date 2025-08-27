const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/storage');

const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated && req.isAuthenticated()) return next();
	req.flash('error', 'Please log in to upload files.');
	return res.redirect('/log-in');
};

fileRouter.get('/', ensureAuth, fileController.showUploadForm);
fileRouter.post(
	'/',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
fileRouter.get('/:id/details', fileController.showFileDetails);
fileRouter.get('/:id/download', ensureAuth, fileController.downloadFile);
module.exports = { fileRouter, ensureAuth };
