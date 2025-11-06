import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  checkIn: { type: Date, default: Date.now },
  checkOut: { type: Date },
  duration: { type: Number }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);