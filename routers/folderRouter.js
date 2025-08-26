const { Router } = require('express');
const folderRouter = Router();
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const upload = require('../storage');
const { ensureAuth } = require('./fileRouter');

folderRouter.get('/', folderController.showFolderForm);
folderRouter.post('/', folderController.createFolder);

folderRouter.get('/:id', folderController.showContents);
folderRouter.post('/:id', folderController.createFolder);
folderRouter.get('/:id/new', folderController.showFolderForm);
folderRouter.get('/:id/upload', fileController.showUploadForm);
folderRouter.post(
	'/:id/upload',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
folderRouter.get('/:id/details', fileController.showFileDetails);

module.exports = folderRouter;
