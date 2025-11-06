// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  
  // Member/Profile fields
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  membershipType: { 
    type: String, 
    enum: ['Basic', 'Premium', 'VIP'], 
    default: 'Basic' 
  },
  address: { 
    type: String,
    trim: true
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Suspended'], 
    default: 'Active' 
  },
  
  // Additional useful fields
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  membershipExpiry: {
    type: Date
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

export default mongoose.model('User', userSchema);