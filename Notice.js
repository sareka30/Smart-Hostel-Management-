const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['general', 'academic', 'hostel', 'mess', 'emergency', 'maintenance', 'event'], required: true },
  priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  attachments: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAudience: { type: String, enum: ['all', 'students', 'staff', 'wardens'], default: 'all' },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
