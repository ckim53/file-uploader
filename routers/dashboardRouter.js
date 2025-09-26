const { Router } = require('express');
const dashboardRouter = Router();
const { showDashboard } = require('../controllers/dashboardController');
const fileController = require('../controllers/fileController');
const folderController = require('../controllers/folderController');
const upload = require('../config/storage');
const { ensureAuth } = require('./fileRouter');

dashboardRouter.get('/', ensureAuth, showDashboard);
dashboardRouter.get('/upload', ensureAuth, fileController.showUploadForm);
dashboardRouter.post(
	'/upload',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
dashboardRouter.get('/new-folder', ensureAuth, folderController.showFolderForm);
dashboardRouter.post('/new-folder', ensureAuth, folderController.createFolder);
module.exports = dashboardRouter;
