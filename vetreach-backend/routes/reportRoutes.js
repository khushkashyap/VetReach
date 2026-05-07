const express = require("express");
const Report = require("../models/reportModel");
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

// 📌 Get all reports
router.get("/", async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

// 📌 Update report status
router.patch("/:id", async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!report) return res.status(404).json({ error: "Report not found" });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
});

module.exports = router;