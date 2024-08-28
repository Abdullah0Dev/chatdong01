const express = require("express");
const {
  getAllMessages,
  newMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/chatController");

const router = express.Router();

// routes
// all messages
router.get("/", getAllMessages);
// new message
router.post("/:id", newMessage);
// update message
router.put("/:id", updateMessage);
// delete message
router.delete("/:id", deleteMessage);

module.exports = router;
