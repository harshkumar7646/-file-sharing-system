
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const zlib = require('zlib');
require('dotenv').config();

// Create GridFS storage
// const storage01 = new GridFsStorage({
//   url: process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//         }
//       }
//       )
//     }
//     )
//   }
// }
//)
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow all file types but with size restrictions
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 50000000; // 50MB default
  
  if (file.size > maxSize) {
    return cb(new Error(`File too large. Maximum size is ${maxSize / 1000000}MB`), false);
  }
  
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50000000,
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: fileFilter
});

// Compression middleware
const compressFiles = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Add compression info to request
  req.files.forEach(file => {
    if (file.size > 1000000) { // Compress files larger than 1MB
      file.shouldCompress = true;
    }
  });

  next();
};

module.exports = {
  upload: upload.array('files', 10),
  compressFiles
};