const path = require('path');
const multer = require('multer');
const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const { env } = require('../config');
const ApiError = require('../utils/ApiError');
const { systemMessage } = require('../messages');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: env.file.folderName,
    resource_type: 'raw',
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadFile = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = env.file.typeAllow;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new ApiError(httpStatus.BAD_REQUEST, systemMessage().FILE_INVALID));
    }
  },
  limits: { fileSize: env.file.maxFileSize },
});

module.exports = { uploadFile };
