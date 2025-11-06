// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// Register new user
export const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      membershipType, 
      address, 
      emergencyContact 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with all fields
    const user = new User({ 
      name, 
      email: email.toLowerCase(),
      password: hashedPassword, 
      role: role || 'user',
      phone,
      membershipType: membershipType || 'Basic',
      address,
      emergencyContact,
      status: 'Active'
    });
    
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Login user (handles both user and admin login)
export const login = async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if loginType matches user's role
    if (loginType && loginType !== user.role) {
      return res.status(403).json({ 
        message: `This account is not registered as ${loginType}. Please use the correct login type.` 
      });
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return res.status(403).json({ 
        message: `Your account is ${user.status}. Please contact support.` 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      name: user.name,
      email: user.email,
      role: user.role 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};