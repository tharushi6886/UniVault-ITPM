require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log("Total users:", users.length);
    
    users.forEach(u => console.log(`Name: ${u.name}, Status: ${u.status}, Email: ${u.email}`));

    const searchStr = "Dilanka";
    const found = await User.find({
      name: { $regex: searchStr, $options: "i" },
      status: "active"
    });
    console.log("Found users with 'Dilanka':", found.length);
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

checkDb();
