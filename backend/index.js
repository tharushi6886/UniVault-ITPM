require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const dbConnection = require("./config/db");

const userRoutes = require("./Routes/userRoutes");
const lostRoutes = require("./routes/lostRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// DB connection
dbConnection();

// Routes
app.use("/api/users", userRoutes);
app.use("/lost", lostRoutes);
app.use("/items", itemRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});