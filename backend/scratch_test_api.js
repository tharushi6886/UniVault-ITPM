require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");

async function test() {
  try {
    // 1. Create a dummy token for 'Thiruni Wijesinghe' (id: 69d0f91d69ad621b0d57b039)
    const token = jwt.sign({ id: "69d0f91d69ad621b0d57b039", role: "Student" }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Generated token:", token);

    // 2. Test search API
    const res = await fetch("http://localhost:5000/api/users/search?search=Dilanka", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

test();
