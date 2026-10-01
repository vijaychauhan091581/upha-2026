const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MEDIA_ROOT } = require('../config/constants');

function createUploader(subfolder = 'uploads') {
  const destDir = path.join(MEDIA_ROOT, subfolder);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e4)}`;
      cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
    },
  });

  return multer({ storage });
}

module.exports = {
  createUploader,
};
