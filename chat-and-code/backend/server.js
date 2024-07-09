const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();
const app = express();

app.use(express.json()); // To accept JSON data in the body

app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`Hello Everyone from ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send({ status: "running" });
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User Joined: ", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
    socket.on("code change", function (data) {
      socket.broadcast.to(roomId).emit("receive code", data);
    });
    socket.on("input change", function (data) {
      socket.broadcast.to(roomId).emit("receive input", data);
    });
    socket.on("output change", function (data) {
      socket.broadcast.to(roomId).emit("receive output", data);
    });
    socket.on("data-for-new-user", function (data) {
      socket.broadcast.to(roomId).emit("receive-data-for-new-user", data);
    });
    socket.on("mode-change-send", function (data) {
      socket.broadcast.to(roomId).emit("mode-change-receive", data);
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected from socket.io");
    socket.leave(userData._id);
  });
});
