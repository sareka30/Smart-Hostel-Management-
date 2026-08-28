const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['leave', 'complaint', 'maintenance', 'fee', 'notice', 'visitor', 'emergency', 'general'], required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedModel: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
