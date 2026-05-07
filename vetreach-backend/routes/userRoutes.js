const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

// 📌 Create or fetch user after Kinde login (auto-register)
router.post("/sync", async (req, res) => {
  try {
    const { kindeId, name, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ kindeId });

    if (!user) {
      // New user — create with default reporter role
      user = new User({ kindeId, name, email, role: "reporter" });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// 📌 Get user by kindeId
router.get("/kinde/:kindeId", async (req, res) => {
  try {
    const user = await User.findOne({ kindeId: req.params.kindeId }).populate("myReports");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// 📌 Get all users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 📌 Update user role (Admin only)
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["reporter", "hospital", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// 📌 Add report to user's myReports
router.patch("/:id/add-report", async (req, res) => {
  try {
    const { reportId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { myReports: reportId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).json({ error: "Failed to add report" });
  }
});

// 📌 Delete user (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;