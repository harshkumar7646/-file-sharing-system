const express = require('express');
const router = express.Router();
const vaultController = require('../controllers/vaultController');
const fileController = require('../controllers/fileController');
const { upload, compressFiles } = require('../middleware/upload');

// Create vault
router.post('/create', vaultController.createVault);

// Access vault
router.post('/access', vaultController.accessVault);

// Get vault by ID
router.get('/:vaultId', vaultController.getVault);

// Upload files to vault
router.post('/:vaultId/upload', upload, compressFiles, fileController.uploadFiles);

// Download file
router.get('/file/:fileId/download', fileController.downloadFile);

// Delete file
router.delete('/file/:fileId', fileController.deleteFile);

module.exports = router;