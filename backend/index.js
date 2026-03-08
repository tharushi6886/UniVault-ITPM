const express = require("express");
const bodyParser = require("body-parser");
const dbConnection = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware (read JSON from Postman / frontend)
app.use(express.json());
app.use(bodyParser.json());

// Database connection
dbConnection();

// Import Routes
const lostRoutes = require("./routes/lostRoutes");
const itemRoutes = require("./routes/itemRoutes"); // buy & sell items

// Default route
app.get("/", (req, res) => {
  res.send("Hello UniVault..!");
});

// Use Routes
app.use("/lost", lostRoutes);
app.use("/items", itemRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});