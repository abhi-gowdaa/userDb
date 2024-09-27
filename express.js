const express = require("express");
const { mongoose } = require("mongoose");
const multer = require("multer");
const connectDB = require("./DataBase/db");
 
const app = express();
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongoDb server
connectDB();
 
//user, address schema
  const userSchema = new mongoose.Schema({
    name: String,
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }], //for 1 to many relation
  });
  const User = mongoose.model("User", userSchema);

  const AddressSchema = new mongoose.Schema({
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  const Address = mongoose.model("Address", AddressSchema);


//api
  app.post("/sendForm", upload.none(), async (req, res) => {
    try {
      const { name, address } = req.body;

      if (!name || !address) {
        return res.status(400).send("Name and address are required.");
      }

      const userName = name.toUpperCase();
      const userAddress = address.toUpperCase();

      let user = await User.findOne({ name: userName });

      //here we check if user already exist
      if (user) {
        const existingAddress = await Address.findOne({address: userAddress,user: user._id,});
     
        if (!existingAddress) {
          const newAddress = await Address.create({address: userAddress,user: user._id,});
          user.address.push(newAddress._id); // here we update address in user field
          await user.save();
        } 
        else {
          return res.status(400).send("This address already exists in db");
        }
      } 
      else {
        const newUser = await User.create({ name: userName });
        const newAddress = await Address.create({  address: userAddress, user: newUser._id});
        newUser.address.push(newAddress._id);
        await newUser.save();
      }
      res.status(201).send("user and address successfully updated");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error in saving user and address");
    }
  });



  app.get("/", async (req, res) => {
    try {
      const user = await User.find();
      if (user.length > 0) {
        res.send(user);
      } else {
        res.send("hi");
      }
    } catch(err){
        res.send(err)
    }
  });

app.listen("5000", () => {
  console.log("server is running on port 5000");
});
