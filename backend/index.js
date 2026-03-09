require("dotenv").config();

const express = require("express");
const cors = require("cors");

const dbConnection = require("./config/db");
const userRoutes = require("./Routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

dbConnection();

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});