const mongoose = require("mongoose");
const Messages = require("../models/Messages");

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const { groupName } = req.params;

    // Fetch messages for the specified group and sort them by timestamp in ascending order
    const groupMessages = await Messages.find({ groupName }).sort({
      timestamp: 1,
    });

    // Return the messages with a 200 status
    return res.status(200).json(groupMessages);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ message: "Couldn't load messages, please try again later" });
  }
};

// Create new message
const newMessage = async (req, res) => {
  try {
    console.log(req.body); // Log the request body

    const { message, timestamp, sender } = req.body;

    if (!message || !timestamp || !sender) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    if (sender !== "me" && sender !== "other") {
      return res.status(400).json({ message: "Invalid sender value" });
    }

    const newMsg = await Messages.create({
      message,
      timestamp,
      sender,
    });

    if (!newMsg) {
      return res.status(500).json({ message: "Failed to create message" });
    }

    // Emit the new message to all connected clients
    const io = req.app.get("socketio");
    io.emit("newMessage", newMsg); // Broadcast the new message

    return res.status(201).json(newMsg);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
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
    const updatedMsg = await Messages.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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

    return res
      .status(200)
      .json({ message: "Message deleted successfully", deletedMsg });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Failed to delete the message" });
  }
};

module.exports = { updateMessage, deleteMessage, newMessage, getAllMessages };
