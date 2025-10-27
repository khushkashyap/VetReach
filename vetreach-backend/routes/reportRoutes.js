const express = require("express");
const Report = require("../models/reportModel"); // Model import karo
const router = express.Router();

// 📌 Create a new report
router.post("/", async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json({ message: "Report submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit report" });
    }
});

module.exports = router;
