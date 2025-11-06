import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  category: { type: String, enum: ['general', 'maintenance', 'event', 'schedule', 'policy'], default: 'general' },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);