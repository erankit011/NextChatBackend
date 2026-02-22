require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8085;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

connectDB();
const app = express();

// // i am using devtunnels for testing, so I need to trust the proxy to allow secure cookies to work properly
// app.set("trust proxy", 1);

// CORS configuration - dynamic based on environment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://4q9600bl-5173.inc1.devtunnels.ms',
  FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));





// // For development/testing, allow all origins (not recommended for production)
// app.use(cors({
//   origin: "*",
//   credentials: true
// }));





app.use(express.json());
app.use(cookieParser());

// Import routes
const userRoutes = require("./routes/user.routes");

const contactRoutes = require("./routes/contact.routes");

// Mount routes
app.use("/api/users", userRoutes);

app.use("/api/contact", contactRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
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
    // console.log(data.message);
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


// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});