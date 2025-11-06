import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Cash', 'Card', 'UPI', 'Net Banking'], default: 'Cash' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String, unique: true, sparse: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);