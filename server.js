require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8085;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ restrict in production
    methods: ["GET", "POST"],
  },
});

// Helper: create system message
const createSystemMessage = (room, message) => ({
  id: `sys-${Date.now()}`,
  room,
  author: "System",
  message,
  time: new Date().toLocaleTimeString(),
  type: "system",
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // ---------------- JOIN ROOM ----------------
  socket.on("join_room", ({ room, username }) => {
    if (!room || !username) return;

    socket.join(room);
    socket.data.room = room;
    socket.data.username = username;

    console.log(`➡️ ${username} joined room ${room}`);

    socket.to(room).emit(
      "system_message",
      createSystemMessage(room, `${username} joined the chat`)
    );
  });

  // ---------------- SEND MESSAGE ----------------
  socket.on("send_message", (data) => {
    if (!data?.room || !data?.message) return;

    socket.to(data.room).emit("receive_message", data);
  });

  // ---------------- TYPING START ----------------
  socket.on("typing", ({ room, username }) => {
    if (!room || !username) return;

    socket.to(room).emit("user_typing", {
      username,
      isTyping: true,
    });
  });

  // ---------------- TYPING STOP ----------------
  socket.on("stop_typing", ({ room, username }) => {
    if (!room || !username) return;

    socket.to(room).emit("user_typing", {
      username,
      isTyping: false,
    });
  });

  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", () => {
    const { room, username } = socket.data;

    if (room && username) {
      socket.to(room).emit(
        "system_message",
        createSystemMessage(room, `${username} left the chat`)
      );
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});