require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportRoutes = require("./routes/reportRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// 🌐 CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}));

// 🛣️ Routes
app.use("/api/reports", reportRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/users", userRoutes);

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err));

// ✅ Basic Route
app.get('/', (req, res) => {
    res.send('✅ VetReach Server is Running');
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));