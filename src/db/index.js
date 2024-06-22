const mongoose = require("mongoose");
const config = require("../config/index.js");

const connectToDB = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = connectToDB;
