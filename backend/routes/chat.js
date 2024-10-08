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
router.get("/:groupName", getAllMessages);
// new message
router.post("/", newMessage);
// update message
router.put("/:id", updateMessage);
// delete message
router.delete("/:id", deleteMessage);

module.exports = router;
