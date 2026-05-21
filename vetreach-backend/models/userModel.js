const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  kindeId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["reporter", "hospital", "admin"], default: "reporter" },
  myReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);