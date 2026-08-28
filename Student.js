const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String },
  department: { type: String },
  year: { type: Number },
  section: { type: String },
  parentName: { type: String },
  parentPhone: { type: String },
  address: { type: String },
  emergencyContact: { type: String },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  blockName: { type: String },
  admissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  photo: { type: String },
  feeStatus: { type: String }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
