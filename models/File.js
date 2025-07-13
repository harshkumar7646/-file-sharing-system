const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  compressedSize: {
    type: Number,
    default: null
  },
  gridfsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  vaultId: {
    type: String,
    required: true,
    index: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isCompressed: {
    type: Boolean,
    default: false
  },
  compressionRatio: {
    type: Number,
    default: 1
  }
});

// Index for automatic cleanup of expired files
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('File', fileSchema);