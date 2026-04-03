import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors());

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);

    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("sent_message", (data) => {
    socket.to(data.room).emit("recive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
