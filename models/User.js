import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  kindeId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["reporter", "hospital", "admin"], default: "reporter" },
  myReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);