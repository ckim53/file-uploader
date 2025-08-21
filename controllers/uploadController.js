const showUploadForm = (req, res) => {
	res.render('upload', { success: req.flash('success') });
};

const uploadFile = (req, res) => {
	req.flash('success', 'File Uploaded!');
	return res.redirect('/upload');
};

module.exports = {
	showUploadForm,
	uploadFile,
};
