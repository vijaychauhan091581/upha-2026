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

function getRelativePath(file) {
  if (!file || !file.path) return null;
  return path.relative(MEDIA_ROOT, file.path).replace(/\\/g, '/');
}

function getFilesMap(req) {
  const map = {};
  if (Array.isArray(req.files)) {
    for (const f of req.files) {
      if (!map[f.fieldname]) map[f.fieldname] = [];
      map[f.fieldname].push(f);
    }
  } else if (req.files && typeof req.files === 'object') {
    for (const [k, v] of Object.entries(req.files)) {
      map[k] = Array.isArray(v) ? v : [v];
    }
  }
  return map;
}

function getFirstFile(req, ...fieldNames) {
  if (req.file) return req.file;
  if (Array.isArray(req.files)) {
    if (fieldNames.length > 0) {
      const found = req.files.find((f) => fieldNames.includes(f.fieldname));
      if (found) return found;
    }
    return req.files[0] || null;
  }
  if (req.files && typeof req.files === 'object') {
    for (const name of fieldNames) {
      if (req.files[name] && req.files[name][0]) return req.files[name][0];
    }
    for (const k of Object.keys(req.files)) {
      if (req.files[k] && req.files[k][0]) return req.files[k][0];
    }
  }
  return null;
}

module.exports = {
  createUploader,
  getRelativePath,
  getFilesMap,
  getFirstFile,
};
