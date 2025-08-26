const { Router } = require('express');
const dashboardRouter = Router();
const { showDashboard } = require('../controllers/dashboardController');
const fileController = require('../controllers/fileController');
const folderController = require('../controllers/folderController');
const upload = require('../storage');
const { ensureAuth } = require('./fileRouter');

dashboardRouter.get('/', showDashboard);
dashboardRouter.get('/upload', fileController.showUploadForm);
dashboardRouter.post(
	'/upload',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
dashboardRouter.get('/new-folder', folderController.showFolderForm);
dashboardRouter.post('/new-folder', folderController.createFolder);
module.exports = dashboardRouter;
