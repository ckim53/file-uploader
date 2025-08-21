const { Router } = require('express');
const uploadRouter = Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

function ensureAuth(req, res, next) {
	if (req.isAuthenticated && req.isAuthenticated()) return next();
	req.flash('error', 'Please log in to upload files.');
	return res.redirect('/log-in');
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
const upload = multer({ storage: storage });

uploadRouter.get('/', ensureAuth, uploadController.showUploadForm);
uploadRouter.post(
	'/',
	ensureAuth,
	upload.single('file'),
	uploadController.uploadFile
);

module.exports = {
	uploadRouter,
};
