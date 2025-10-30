const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const { ErrorResponse } = require('./errorHandler');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (!config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(new ErrorResponse('Invalid file type', 400), false);
  }
  cb(null, true);
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  }
});

module.exports = upload;