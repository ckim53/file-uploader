const { Router } = require('express');
const folderRouter = Router();
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const upload = require('../config/storage');
const { ensureAuth } = require('./fileRouter');

folderRouter.get('/', ensureAuth, folderController.showFolderForm);
folderRouter.post('/', folderController.createFolder);

folderRouter.get('/:id', ensureAuth, folderController.showContents);
folderRouter.post(
	'/:id',
	ensureAuth,
	ensureAuth,
	folderController.createFolder
);
folderRouter.get('/:id/new', ensureAuth, folderController.showFolderForm);
folderRouter.get('/:id/upload', ensureAuth, fileController.showUploadForm);
folderRouter.post(
	'/:id/upload',
	ensureAuth,
	upload.single('file'),
	fileController.createFile
);
folderRouter.get('/:id/details', ensureAuth, fileController.showFileDetails);
folderRouter.get(
	'/:id/new-folder',
	ensureAuth,
	folderController.showFolderForm
);
folderRouter.post('/:id/new-folder', ensureAuth, folderController.createFolder);
folderRouter.put('/:id/edit', ensureAuth, folderController.editFolder);
folderRouter.delete('/:id', ensureAuth, folderController.deleteFolder);
module.exports = folderRouter;
