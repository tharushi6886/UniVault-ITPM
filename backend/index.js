require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const dbConnection = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const itemRoutes = require("./routes/itemRoutes");
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Make io accessible in routers
app.set("io", io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('send_message', (data) => {
    // Broadcast the message to everyone (frontend will filter by ID)
    io.emit('receive_message', data);
  });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

dbConnection();

app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

module.exports = server;

// Error handler for payload too large and other body parsing errors
app.use((err, req, res, next) => {
  if (err) {
    console.error('Express error handler caught:', err.message || err);
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ message: 'Payload too large. Reduce image size or upload via multipart/form-data.' });
    }
    return res.status(500).json({ message: err.message || 'Server error' });
  }
  next();
});