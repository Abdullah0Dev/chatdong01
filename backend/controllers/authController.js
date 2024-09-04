const User = require("../models/User");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

const JWT_SECRET = "123456"; // Replace this with your actual secret key

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Only return the username field

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ message: "Couldn't load users, please try again later" });
  }
};

// Handle user registration and login
const handleUserRegistration = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // If the user exists, compare the password using bcrypt
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // Generate JWT token
      const token = jwt.sign({ username: existingUser.username }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return res
        .status(200)
        .json({
          message: "Login successful",
          username: existingUser.username,
          token,
        });
    }

    // If the user doesn't exist, hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with a salt round of 10

    const newUser = await User.create({ username, password: hashedPassword });

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Generate JWT token for the new user
    const token = jwt.sign({ username: newUser.username }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(201)
      .json({
        message: "User registered successfully",
        username: newUser.username,
        token,
      });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  getAllUsers,
  handleUserRegistration,
};
