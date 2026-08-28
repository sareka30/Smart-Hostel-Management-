const mongoose = require('mongoose');

const foodWasteSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  mealType: { type: String, required: true },
  preparedQuantity: { type: Number, required: true },
  servedQuantity: { type: Number, required: true },
  wasteQuantity: { type: Number, required: true },
  studentsServed: { type: Number },
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

foodWasteSchema.virtual('wastePercentage').get(function() {
  if (this.preparedQuantity === 0) return 0;
  return (this.wasteQuantity / this.preparedQuantity) * 100;
});

const FoodWaste = mongoose.model('FoodWaste', foodWasteSchema);
module.exports = FoodWaste;
