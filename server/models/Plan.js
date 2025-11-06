import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  features: [{ type: String }],
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);