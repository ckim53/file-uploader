const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config();

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'my_uploads',
	},
});

module.exports = { cloudinary, storage };
