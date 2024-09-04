const express = require("express");
const {
  getAllUsers,
  handleUserRegistration 
} = require("../controllers/authController");

const router = express.Router();

// routes
// all users
router.get("/", getAllUsers);
// new user
router.post("/", handleUserRegistration); 
module.exports = router;
