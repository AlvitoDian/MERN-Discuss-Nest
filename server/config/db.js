// db.js
const mongoose = require("mongoose");
require("dotenv").config();

/* const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}; */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI /* , connectionParams */);
    console.info("Connected to Database");
  } catch (e) {
    console.log("Error : ", e);
  }
};

module.exports = connectDB;
