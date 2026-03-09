// server.mjs  (or add "type": "module" to package.json and use server.js)

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

// ─── App Setup ────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change this to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect("mongodb://localhost:27017/chatapp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── Message Schema ───────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  roomId:     { type: String, required: true }, // userId = roomId
  sender:     { type: String, required: true }, // "user" or "admin"
  senderName: { type: String, required: true },
  message:    { type: String, required: true },
  timestamp:  { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// ─── REST API: Get chat history for a room ────────────────────
app.get("/messages/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── REST API: Get all rooms (for admin to see all users) ─────
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Message.aggregate([
      {
        $group: {
          _id:         "$roomId",
          lastMessage: { $last: "$message" },
          lastTime:    { $last: "$timestamp" },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Socket.io ────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("chatMessage", async (data) => {
    const { roomId, sender, senderName, message } = data;
    try {
      const newMessage = await Message.create({ roomId, sender, senderName, message });

      io.to(roomId).emit("chatMessage", {
        _id: newMessage._id,
        roomId,
        sender,
        senderName,
        message,
        timestamp: newMessage.timestamp,
      });

      console.log(`💬 [${roomId}] ${senderName}: ${message}`);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("notifyAdmin", (data) => {
    io.emit("newUserMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});