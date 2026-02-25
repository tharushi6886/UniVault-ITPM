const express = require("express");
const dbConnection = require("./config/db");

const app = express();

//DB connection
dbConnection();

app.get("/",(req, res) => res.send("Hello UniFault..! "));

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));