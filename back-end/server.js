const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
require("dotenv").config();
require("./Connection");
const roomRoutes = require("./routes/RoomRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const MessageModel = require("./models/MessageModel");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 8082;
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json("Welcome to the file share project");
});

app.use("/room", roomRoutes);
app.use("/message", messageRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});
io.on("connection", async (socket) => {
  console.log("SOCKET::", socket.id);
  socket.on("add-message",async (message) => {
    console.log("MESSAGE::", message);
    const newMessage = new MessageModel(message);
    await newMessage.save();
    socket.broadcast.emit('new-message', newMessage)
  });
  socket.on("join-room", async (roomId) => {
    console.log('JOINED_ROOM::', roomId)
    socket.join(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
