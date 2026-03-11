const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToMongoDB;