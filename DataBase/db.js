const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
    .connect("mongodb+srv://itsa3129:q4eWuYbj1D2aGoBA@cluster0.7feow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB", err);
    });
  } catch (err) {
    console.error("Could not connect to MongoDB server", err);
  }
};

module.exports = connectDB;


 
   
  