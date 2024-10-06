const mongoose = require("mongoose");
const MONGO = "mongodb+srv://atlasmongodb50:mongodbatlas@cluster0.bpkjrz8.mongodb.net/library";



mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB database connected successfully.");
});

module.exports = db;