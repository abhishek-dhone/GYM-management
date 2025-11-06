// controllers/userController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get all members with pagination and filtering
export const getAllMembers = async (req, res) => {
  try {
    const { page = 1, limit = 100, status, membershipType } = req.query;
    
    // Build filter - only show users with 'user' role (not admins)
    const filter = { role: 'user' };
    if (status) filter.status = status;
    if (membershipType) filter.membershipType = membershipType;

    const members = await User.find(filter)
      .select('-password') // Don't send password in response
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments(filter);
    
    res.json({
      members,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single member by ID
export const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new member (admin adding member manually)
export const createMember = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      membershipType, 
      address, 
      emergencyContact,
      password // Optional: admin can set password or generate one
    } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'A member with this email already exists' });
    }

    // Generate default password if not provided
    const defaultPassword = password || 'Member@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create new member
    const member = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      membershipType: membershipType || 'Basic',
      address,
      emergencyContact,
      role: 'user',
      status: 'Active'
    });

    const newMember = await member.save();
    
    // Don't send password in response
    const memberResponse = newMember.toObject();
    delete memberResponse.password;
    
    res.status(201).json(memberResponse);
  } catch (error) {
    console.error('Error adding member:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists in database' });
    }
    
    res.status(500).json({ message: 'Server error while adding member', error: error.message });
  }
};

// Update member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates.role; // Prevent role changes through member update

    // Check if email is being changed and if it's already taken
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use by another member' });
      }
      updates.email = updates.email.toLowerCase();
    }

    updates.updatedAt = Date.now();

    const updatedMember = await User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Delete member
export const deleteMember = async (req, res) => {
  try {
    const deletedMember = await User.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get member statistics (useful for dashboard)
// controllers/memberController.js

// Add this to your existing userController.js

export const getMemberStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'user' });
    const activeMembers = await User.countDocuments({ role: 'user', status: 'Active' });
    const inactiveMembers = await User.countDocuments({ role: 'user', status: 'Inactive' });
    
    const membershipTypes = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$membershipType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalMembers,
      activeMembers,
      inactiveMembers,
      membershipTypes
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
};