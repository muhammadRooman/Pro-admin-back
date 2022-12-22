const mongoose = require("mongoose");
const db = process.env.MONGODB_URL;
// console.log("db", db);
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = connectDB;
