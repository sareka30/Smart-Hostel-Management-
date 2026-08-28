const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  category: { type: String, enum: ['room', 'electrical', 'plumbing', 'wifi', 'cleaning', 'food', 'security', 'furniture', 'other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'low' },
  images: [{ type: String }],
  status: { type: String, enum: ['submitted', 'assigned', 'in_progress', 'resolved', 'closed'], default: 'submitted' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date },
  resolvedAt: { type: Date },
  timeline: [{
    action: String,
    by: String,
    timestamp: Date,
    note: String
  }]
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
