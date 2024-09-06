const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  timestamp: {
    type: String,
    default: () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
  sender: {
    type: String,
    // enum: ["me", "other"], // Limits the sender to either 'me' or 'other'
    required: [true, "Sender is required"],
    default: "me",
  },
  image: String,
  deviceId: String,
  groupName: String,
});

module.exports = mongoose.model("Messages", messageSchema);
