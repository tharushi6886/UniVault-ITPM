const express = require("express");
const dbConnection = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware (to read JSON from Postman)
app.use(express.json());

// Database connection
dbConnection();

// Import Lost routes
const lostRoutes = require("./routes/lostRoutes");

// Default route
app.get("/", (req, res) => res.send("Hello UniVault..!"));

// Use Lost routes
app.use("/lost", lostRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));