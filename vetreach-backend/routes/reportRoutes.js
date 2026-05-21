const express = require("express");
const Report = require("../models/reportModel");
const Hospital = require("../models/hospitalModel");
const { getIO } = require("../socket");
const router = express.Router();

// Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 📌 Create a new report + notify nearest hospital
router.post("/", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();

    // Find nearest hospital
    const hospitals = await Hospital.find({ isActive: true });
    if (hospitals.length > 0 && req.body.latitude && req.body.longitude) {
      const nearest = hospitals
        .map((h) => ({
          ...h._doc,
          distance: getDistance(req.body.latitude, req.body.longitude, h.latitude, h.longitude),
        }))
        .sort((a, b) => a.distance - b.distance)[0];

      // Assign hospital to report
      await Report.findByIdAndUpdate(report._id, { assignedHospital: nearest._id });

      // Add report to hospital's assignedReports
      await Hospital.findByIdAndUpdate(nearest._id, {
        $push: { assignedReports: report._id },
      });

      // Notify nearest hospital via Socket.io
      try {
        const io = getIO();
        io.to(nearest._id.toString()).emit("incoming_report", {
          ...report._doc,
          assignedHospital: nearest._id,
        });
        console.log(`🏥 Report assigned to nearest hospital: ${nearest.name}`);
      } catch (socketErr) {
        console.warn("Socket.io not available:", socketErr.message);
      }
    }

    res.status(201).json({ message: "Report submitted successfully!", reportId: report._id });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// 📌 Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("assignedHospital", "name phone")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// 📌 Get reports by reporter kindeId
router.get("/reporter/:kindeId", async (req, res) => {
  try {
    const reports = await Report.find({ reporterKindeId: req.params.kindeId })
      .populate("assignedHospital", "name phone")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// 📌 Update report status + notify reporter
router.patch("/:id", async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: "Report not found" });

    // Notify reporter via Socket.io
    if (report.reporterKindeId) {
      try {
        const io = getIO();
        io.to(report.reporterKindeId).emit("status_update", {
          reportId: report._id,
          status: report.status,
          message: `Your rescue request is now: ${report.status}`,
        });
      } catch (socketErr) {
        console.warn("Socket.io not available:", socketErr.message);
      }
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;