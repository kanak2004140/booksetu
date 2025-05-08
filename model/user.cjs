const { Router } = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const router = Router(); // Removed as it's not used
const signupSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
   
    phoneNumber: { type: String, required: true },
    
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postelcode: { type: String, required: true },
});
const Signup = mongoose.model("Signup", signupSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
});

const PORT = process.env.PORT || 5000;

module.exports = {
  User: mongoose.model("User", UserSchema),
  Signup,
  PORT,
};
