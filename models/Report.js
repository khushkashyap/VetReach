import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  animalType: String,
  animalCount: String,
  severity: String,
  latitude: Number,
  longitude: Number,
  message: String,
  imageUrl: String,
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);