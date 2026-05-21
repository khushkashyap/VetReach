const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    animalType: { type: String, required: true },
    animalCount: { type: String, required: true },
    severity: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String, required: true },
    assignedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    status: { type: String, default: 'Pending' },
    reporterKindeId: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Report', reportSchema);
