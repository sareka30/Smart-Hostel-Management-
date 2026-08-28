const mongoose = require('mongoose');

const foodFeedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MessMenu' },
  date: { type: Date, required: true },
  mealType: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  issues: [{ type: String }]
}, { timestamps: true });

const FoodFeedback = mongoose.model('FoodFeedback', foodFeedbackSchema);
module.exports = FoodFeedback;
