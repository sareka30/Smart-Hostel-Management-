const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  department: { type: String },
  role: { type: String, enum: ['warden', 'cleaner', 'security', 'electrician', 'plumber', 'mess_staff', 'maintenance'], required: true },
  joiningDate: { type: Date },
  salary: { type: Number },
  address: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
  assignedBlocks: [{ type: String }],
  currentTasks: [{ type: mongoose.Schema.Types.ObjectId }]
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
