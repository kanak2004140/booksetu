const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.cjs");
// const Book = require("../model/Book");
const router = express.Router();
require("dotenv").config();

// Register
router.post("/signup", async (req, res) => {
  const { fullName, email, birthDate, phoneNumber, gender, address, country, city, postelcode } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedbirthDate = await bcrypt.hash(req.body.birthDate, 10);
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      birthDate: hashedbirthDate,
      gender,
      address,
      country,
      city,
      postelcode,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, birthDate } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(birthDate, user.birthDate);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;