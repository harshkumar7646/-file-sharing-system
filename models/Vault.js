const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  vaultId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxDownloads: {
    type: Number,
    default: null
  },
  totalDownloads: {
    type: Number,
    default: 0
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
});

// Index for automatic cleanup of expired vaults
vaultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Vault', vaultSchema);