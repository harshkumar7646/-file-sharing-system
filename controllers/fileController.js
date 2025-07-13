const File = require('../models/File');
const Vault = require('../models/Vault');
const mongoose = require('mongoose');
const { getGFS } = require('../config/connection');
const zlib = require('zlib');
const stream = require('stream');

// Upload files to vault
const uploadFiles = async (req, res) => {
  try {
    const { vaultId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded.' 
      });
    }

    const vault = await Vault.findOne({ vaultId, isActive: true });
    if (!vault) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vault not found.' 
      });
    }

    const gfs = getGFS();
    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Create new file document
        const fileDoc = new File({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          gridfsId: file.id,
          vaultId: vaultId
        });

        await fileDoc.save();
        
        // Add file to vault
        vault.files.push(fileDoc._id);
        
        uploadedFiles.push({
          id: fileDoc._id,
          filename: file.originalname,
          size: file.size
        });
      } catch (fileError) {
        console.error('Error saving file:', fileError);
      }
    }

    await vault.save();

    res.json({ 
      success: true, 
      message: `${uploadedFiles.length} files uploaded successfully.`,
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading files.' 
    });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).render('error', { 
        message: 'File not found.',
        error: null 
      });
    }

    // Check if file has expired
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).render('error', { 
        message: 'This file has expired.',
        error: null 
      });
    }

    // Check download limits
    if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
      return res.status(403).render('error', { 
        message: 'Download limit reached for this file.',
        error: null 
      });
    }

    const vault = await Vault.findOne({ vaultId: file.vaultId });
    if (vault?.maxDownloads && vault.totalDownloads >= vault.maxDownloads) {
      return res.status(403).render('error', { 
        message: 'Download limit reached for this vault.',
        error: null 
      });
    }

    const gfs = getGFS();
    
    // Create download stream
    const downloadStream = gfs.createReadStream({ _id: file.gridfsId });
    
    // Set headers
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`
    });

    // Handle stream events
    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      if (!res.headersSent) {
        res.status(404).render('error', { 
          message: 'File not found in storage.',
          error: null 
        });
      }
    });

    downloadStream.on('end', async () => {
      try {
        // Update download counts
        file.downloadCount += 1;
        await file.save();
        
        if (vault) {
          vault.totalDownloads += 1;
          await vault.save();
        }
      } catch (updateError) {
        console.error('Error updating download count:', updateError);
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).render('error', { 
      message: 'Error downloading file.',
      error: error 
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found.' 
      });
    }

    const gfs = getGFS();
    
    // Delete from GridFS
    gfs.remove({ _id: file.gridfsId }, async (err) => {
      if (err) {
        console.error('Error deleting from GridFS:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error deleting file from storage.' 
        });
      }

      // Remove from vault
      await Vault.updateOne(
        { vaultId: file.vaultId },
        { $pull: { files: file._id } }
      );

      // Delete file document
      await File.findByIdAndDelete(fileId);

      res.json({ 
        success: true, 
        message: 'File deleted successfully.' 
      });
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting file.' 
    });
  }
};

module.exports = {
  uploadFiles,
  downloadFile,
  deleteFile
};