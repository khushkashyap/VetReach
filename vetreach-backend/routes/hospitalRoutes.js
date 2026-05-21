const express = require("express");
const Hospital = require("../models/hospitalModel");
const Report = require("../models/reportModel");
const router = express.Router();

// 📌 Register a new hospital
router.post("/register", async (req, res) => {
  try {
    const existing = await Hospital.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ error: "Hospital already registered" });
    }
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital registered successfully!", hospital });
  } catch (error) {
    console.error("Error registering hospital:", error);
    res.status(500).json({ error: "Failed to register hospital" });
  }
});

// 📌 Get all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

// 📌 Get single hospital by kindeId
router.get("/kinde/:kindeId", async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ kindeId: req.params.kindeId });
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ error: "Failed to fetch hospital" });
  }
});

// 📌 Get nearest hospital based on lat/lng (Haversine formula)
router.get("/nearest", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const hospitals = await Hospital.find({ isActive: true });

    if (hospitals.length === 0) {
      return res.status(404).json({ error: "No active hospitals found" });
    }

    // Haversine formula
    const toRad = (val) => (val * Math.PI) / 180;
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const hospitalsWithDistance = hospitals.map((h) => ({
      ...h._doc,
      distance: getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        h.latitude,
        h.longitude
      ),
    }));

    hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
    res.status(200).json(hospitalsWithDistance[0]); // Nearest hospital
  } catch (error) {
    console.error("Error finding nearest hospital:", error);
    res.status(500).json({ error: "Failed to find nearest hospital" });
  }
});

// 📌 Get assigned reports for a hospital
router.get("/:id/reports", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate("assignedReports");
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.status(200).json(hospital.assignedReports);
  } catch (error) {
    console.error("Error fetching assigned reports:", error);
    res.status(500).json({ error: "Failed to fetch assigned reports" });
  }
});

// 📌 Update hospital details
router.patch("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ error: "Failed to update hospital" });
  }
});

// 📌 Toggle hospital active status (Admin only)
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    hospital.isActive = !hospital.isActive;
    await hospital.save();
    res.status(200).json({ message: `Hospital ${hospital.isActive ? "activated" : "deactivated"}`, hospital });
  } catch (error) {
    console.error("Error toggling hospital status:", error);
    res.status(500).json({ error: "Failed to toggle hospital status" });
  }
});

// 📌 Delete hospital (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    res.status(500).json({ error: "Failed to delete hospital" });
  }
});

module.exports = router;