require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.use(express.json());

// 🌐 Allow only your frontend domain (Replace with actual frontend URL)
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use("/api/reports", reportRoutes);


// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err));

// ✅ Basic Route
app.get('/', (req, res) => {
    res.send('✅ VetReach Server is Running 🚀');
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
