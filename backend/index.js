require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Messages");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // Use promises for async file operations
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const { hostname } = require("os");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected with ID:", socket.id);
  // add new user
  socket.on("new-user-add", (newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      // if user is not added before
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
    }
    // send all active users to new user
    io.emit("get-users", onlineUsers);
  });
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
        image: message.image,
      });

      const savedMessage = await newMessage.save();
      io.to(message.groupName).emit("newMessage", savedMessage);
    } catch (error) {
      console.log("Error saving message to the database:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id); // remove the user that logged out
    console.log("user disconnected", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
  socket.on("offline", () => {
    // remove user from active users
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("user is offline", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
});

// Updated multer storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10mb
}).single("myFile");

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/messages", require("./routes/chat"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/group"));
app.post("/api/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Please send a file" });
    }

    try {
      const base64Image = req.file.buffer.toString("base64"); // Convert buffer to base64 once

      // Use the buffer to make prediction
      const response = await new Promise((resolve, reject) => {
        stub.PostModelOutputs(
          {
            model_id: "aaa03c23b3724a16a56b629203edc62c", // General model ID
            inputs: [
              {
                data: {
                  image: {
                    base64: base64Image,
                  },
                },
              },
            ],
          },
          metadata,
          (err, response) => {
            if (err) {
              reject(err);
              return;
            }
            if (response.status.code !== 10000) {
              reject(response.status.description);
              return;
            }
            resolve(response);
          }
        );
      });

      const description = response.outputs[0].data.concepts[0].name;
      const newFilename = `${description}_${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      const filePath = path.join(__dirname, "uploads", newFilename);

      // Save the file asynchronously
      await fs.writeFile(filePath, req.file.buffer);
      const protocol = req.protocol;

      const fileUrl = `https://${req.get(
        "host"
      )}/uploads/${newFilename}`;
      res.status(200).json({ url: fileUrl });
      console.log(protocol);
    } catch (error) {
      console.error("Error fetching image description:", error);
      res.status(500).json({ error: "Image recognition failed" });
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
