const express = require("express");
const bodyParser = require("body-parser");
const dbConnection = require("./config/db");
require("dotenv").config();

const itemRoutes = require("./routes/itemRoutes");

const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// database connection
dbConnection();

// test route
app.get("/", (req, res) => res.send("Hello UniVault..!"));

// item routes
app.use("/api/items", itemRoutes);

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});