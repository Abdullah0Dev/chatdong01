require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Create the HTTP server
const server = http.createServer(app);

// Initialize socket.io with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust based on your CORS settings
    methods: ["GET", "POST"],
  },
});

// Store socket.io instance in the app for later use
app.set("socketio", io);

// Handle socket connection events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Import and use routes
const chatRoutes = require("./routes/chat"); // Adjust path if necessary
app.use("/api/messages", chatRoutes);
// app.use('/', (req, res) => {
//   res.send("Hey ya, what's up? you've in my server")
// })
// Database connection and server startup
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "your-default-mongodb-uri-here";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Connected to MongoDB & server running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(`Server Error! ${error.message}`));
