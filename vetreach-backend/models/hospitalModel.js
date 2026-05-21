const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  kindeId: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  assignedReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);