const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext);
		let finalName = file.originalname;
		let counter = 1;
		while (fs.existsSync(path.join(uploadDir, finalName))) {
			finalName = `${base}(${counter})${ext}`;
			counter++;
		}
		cb(null, finalName);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
