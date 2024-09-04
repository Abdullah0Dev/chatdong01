require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Messages");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("A user connected with ID:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("typing", (data) => {
    socket.to(data.groupName).emit("userTyping", data);
  });

  socket.on("newMessage", async (message) => {
    console.log("A user sent message:", message);

    try {
      const newMessage = new Message({
        message: message.message,
        sender: message.sender,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        groupName: message.groupName,
      });

      const savedMessage = await newMessage.save();

      io.to(message.groupName).emit("newMessage", savedMessage);
    } catch (error) {
      console.log("Error saving message to the database:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use("/api/messages", require("./routes/chat"));
app.use("/api/auth", require("./routes/auth"));
app.post("api/upload_files", upload.single("files"), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
  fs.readFile(req.file.path, (err, contents) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("File contents ", contents);
    }
  });
});
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(`Server Error! ${error.message}`));
