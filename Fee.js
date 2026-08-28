const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { type: String, enum: ['hostel', 'mess', 'maintenance', 'other'], required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  paymentDate: { type: Date },
  paymentMethod: { type: String },
  transactionId: { type: String },
  status: { type: String, enum: ['paid', 'partial', 'pending', 'overdue'], default: 'pending' },
  month: { type: String },
  year: { type: Number },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String }
}, { timestamps: true });

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
