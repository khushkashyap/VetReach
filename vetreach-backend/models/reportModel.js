const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    animalType: { type: String, required: true },
    location: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
