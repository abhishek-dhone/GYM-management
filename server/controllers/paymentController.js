import Payment from '../models/Payment.js';

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('memberId', 'name email').sort({ date: -1 });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};