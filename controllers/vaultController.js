const Vault = require('../models/Vault');
const File = require('../models/File');
const crypto = require('crypto');
const moment = require('moment');

// Generate unique vault ID
const generateVaultId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Create new vault
const createVault = async (req, res) => {
  try {
    const { name, description, expiryHours, maxDownloads } = req.body;
    
    const vaultId = generateVaultId();
    
    // Calculate expiry date if provided
    let expiresAt = null;
    if (expiryHours && parseInt(expiryHours) > 0) {
      expiresAt = moment().add(parseInt(expiryHours), 'hours').toDate();
    }

    const vault = new Vault({
      vaultId,
      name: name.trim(),
      description: description?.trim(),
      expiresAt,
      maxDownloads: maxDownloads ? parseInt(maxDownloads) : null
    });

    await vault.save();

    res.redirect(`/vault/${vaultId}`);
  } catch (error) {
    console.error('Error creating vault:', error);
    res.render('error', { 
      message: 'Failed to create vault. Please try again.',
      error: error 
    });
  }
};

// Get vault details
const getVault = async (req, res) => {
  try {
    const { vaultId } = req.params;
    
    const vault = await Vault.findOne({ vaultId, isActive: true })
      .populate('files');

    if (!vault) {
      return res.render('error', { 
        message: 'Vault not found or has expired.',
        error: null 
      });
    }

    // Check if vault has expired
    if (vault.expiresAt && new Date() > vault.expiresAt) {
      vault.isActive = false;
      await vault.save();
      return res.render('error', { 
        message: 'This vault has expired.',
        error: null 
      });
    }

    // Check download limits
    if (vault.maxDownloads && vault.totalDownloads >= vault.maxDownloads) {
      return res.render('error', { 
        message: 'Download limit reached for this vault.',
        error: null 
      });
    }

    res.render('vault', { 
      vault,
      files: vault.files,
      moment 
    });
  } catch (error) {
    console.error('Error fetching vault:', error);
    res.render('error', { 
      message: 'Error accessing vault.',
      error: error 
    });
  }
};

// Access vault by ID (for sharing)
const accessVault = async (req, res) => {
  try {
    const { vaultId } = req.body;
    
    if (!vaultId) {
      return res.render('access', { 
        error: 'Please enter a valid Vault ID.' 
      });
    }

    const vault = await Vault.findOne({ 
      vaultId: vaultId.trim(), 
      isActive: true 
    });

    if (!vault) {
      return res.render('access', { 
        error: 'Vault not found or has expired.' 
      });
    }

    // Check if vault has expired
    if (vault.expiresAt && new Date() > vault.expiresAt) {
      return res.render('access', { 
        error: 'This vault has expired.' 
      });
    }

    res.redirect(`/vault/${vaultId.trim()}`);
  } catch (error) {
    console.error('Error accessing vault:', error);
    res.render('access', { 
      error: 'Error accessing vault. Please try again.' 
    });
  }
};

module.exports = {
  createVault,
  getVault,
  accessVault
};