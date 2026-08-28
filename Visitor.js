const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  visitorName: { type: String, required: true },
  visitorPhone: { type: String, required: true },
  relationship: { type: String, required: true },
  purpose: { type: String },
  visitDate: { type: Date, required: true },
  expectedArrival: { type: Date },
  expectedDeparture: { type: Date },
  actualArrival: { type: Date },
  actualDeparture: { type: Date },
  idProofType: { type: String },
  idProofNumber: { type: String },
  visitorPhoto: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'checked_in', 'checked_out', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String }
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;
