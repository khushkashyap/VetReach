import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  animalType: String,
  location: String,
  message: String,
  imageUrl: String,
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
