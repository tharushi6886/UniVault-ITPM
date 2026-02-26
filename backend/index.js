const express = require("express");
const dbConnection = require("./config/db");
require("dotenv").config();   // 👉 VERY IMPORTANT

const app = express();

// DB connection
dbConnection();

app.get("/", (req, res) => res.send("Hello UniVault..!"));

const PORT = process.env.PORT || 5000;   // 👉 env eken gannawa

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

//password: 1992Hjg
//username: admin