const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
});

// Add new address
router.post('/address', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If this is the first address, set it as default
    const newAddress = {
      ...req.body,
      isDefault: user.addresses.length === 0
    };
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Error adding address', error: error.message });
  }
});

// Update address
router.put('/address/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...req.body
    };
    
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Error updating address', error: error.message });
  }
});

// Delete address
router.delete('/address/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting address', error: error.message });
  }
});

// Set default address
router.put('/address/:addressId/default', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.addressId;
    });
    
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Error setting default address', error: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Verify current password
    const isCorrect = await user.correctPassword(currentPassword, user.password);
    if (!isCorrect) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error changing password', error: error.message });
  }
});

module.exports = router;