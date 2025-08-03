const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shortId = require('shortid');

const uploadDir = path.join(process.cwd(), 'public', 'assets', 'images');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive: true})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const whiteListFormat = [
      'image/png', 
      'image/jpeg', 
      'image/jpg', 
      'image/webp'
    ];

    if (whiteListFormat.includes(file.mimetype)) {
      const extension = path.extname(file.originalname);
      const filename = `${shortId.generate()}${extension}`;
      cb(null, filename)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3 MB
  }
});

module.exports = upload;


