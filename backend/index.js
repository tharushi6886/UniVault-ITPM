require("dotenv").config();

const express = require("express");
const cors = require("cors");

const dbConnection = require("./config/db");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const bidRoutes = require("./routes/bidRoutes");
const itemRoutes = require("./routes/itemRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

dbConnection();

app.use("/api/users", userRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});