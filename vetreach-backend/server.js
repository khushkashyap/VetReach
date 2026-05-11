require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { init } = require('./socket');

const reportRoutes = require("./routes/reportRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

// 🔌 Socket.io setup
const io = init(server)

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

// 🔌 Socket.io Events
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Hospital joins their own room
  socket.on('join_hospital', (hospitalId) => {
    socket.join(hospitalId);
    console.log(`🏥 Hospital ${hospitalId} joined their room`);
  });

  // Reporter joins their own room to track report status
  socket.on('join_reporter', (reporterId) => {
    socket.join(reporterId);
    console.log(`👤 Reporter ${reporterId} joined their room`);
  });

  // New report submitted — notify nearest hospital
  socket.on('new_report', (data) => {
    const { hospitalId, report } = data;
    io.to(hospitalId).emit('incoming_report', report);
    console.log(`🐾 New report sent to hospital: ${hospitalId}`);
  });

  // Hospital accepts rescue — notify reporter
  socket.on('rescue_accepted', (data) => {
    const { reporterId, report } = data;
    io.to(reporterId).emit('status_update', {
      reportId: report._id,
      status: 'Accepted',
      message: 'A hospital has accepted your rescue request!'
    });
    console.log(`✅ Rescue accepted, reporter ${reporterId} notified`);
  });

  // Status update — notify reporter
  socket.on('status_update', (data) => {
    const { reporterId, reportId, status } = data;
    io.to(reporterId).emit('status_update', {
      reportId,
      status,
      message: `Your rescue request is now: ${status}`
    });
    console.log(`🔄 Status updated to ${status} for reporter ${reporterId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export io for use in routes
module.exports = { io };