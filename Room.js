const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  block: { type: String, required: true },
  floor: { type: Number, required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  roomType: { type: String, enum: ['single', 'double', 'triple', 'quad'], required: true },
  capacity: { type: Number, required: true },
  occupiedBeds: { type: Number, default: 0 },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  status: { type: String, enum: ['available', 'occupied', 'maintenance', 'reserved'], default: 'available' },
  amenities: [{ type: String }],
  monthlyRent: { type: Number },
  description: { type: String }
}, { timestamps: true });

roomSchema.virtual('availableBeds').get(function() {
  return this.capacity - this.occupiedBeds;
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
