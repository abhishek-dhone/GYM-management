import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  specialization: { type: String, trim: true },
  experience: { type: Number, default: 0 },
  certification: { type: String, trim: true },
  salary: { type: Number },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Trainer', trainerSchema);