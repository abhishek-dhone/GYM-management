import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  instructor: { type: String, required: true, trim: true },
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  capacity: { type: Number, required: true },
  enrolled: { type: Number, default: 0 },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Class', classSchema);