const mongoose = require("mongoose");
const Messages = require("../models/Messages");

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    // Fetch all messages and sort them by timestamp in ascending order
    const allMessages = await Messages.find().sort({ timestamp: 1 });

    // Check if any messages were found
    if (!allMessages || allMessages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Return the messages with a 200 status
    return res.status(200).json(allMessages);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Couldn't load messages, please try again later" });
  }
};

// Create new message
const newMessage = async (req, res) => {
  try {
    const { message, timestamp, sender } = req.body;
    const { id } = req.params; // Represents chat ID or user ID

    if (!message || !timestamp || !sender) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (sender !== "me" && sender !== "other") {
      return res.status(400).json({ message: "Invalid sender value" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const newMsg = await Messages.create({
      chatId: id,
      message,
      timestamp,
      sender,
    });

    if (!newMsg) {
      return res.status(500).json({ message: "Failed to create message" });
    }

    // Emit the new message event to all connected clients via socket.io
    const io = req.app.get("socketio");
    io.emit("newMessage", newMsg);

    return res.status(201).json(newMsg);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Update message
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const updatedMsg = await Messages.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMsg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const io = req.app.get("socketio");
    io.emit("messageUpdated", updatedMsg);

    return res.status(200).json(updatedMsg);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Failed to update the message" });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const deletedMsg = await Messages.findByIdAndDelete(id);

    if (!deletedMsg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const io = req.app.get("socketio");
    io.emit("messageDeleted", id);

    return res.status(200).json({ message: "Message deleted successfully", deletedMsg });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Failed to delete the message" });
  }
};

module.exports = { updateMessage, deleteMessage, newMessage, getAllMessages };
