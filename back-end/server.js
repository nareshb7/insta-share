const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
require("dotenv").config();
require("./Connection");
const roomRoutes = require("./routes/RoomRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const fileRoutes = require('./routes/Files')
const MessageModel = require("./models/MessageModel");
const { RoomModel } = require("./models/RoomModel");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 8082;
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json("Welcome to the file share project");
});

app.use("/room", roomRoutes);
app.use("/message", messageRoutes);
app.use("/files", fileRoutes)

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});
const liveChatObject = {}
io.on("connection", async (socket) => {
  console.log('SOCKET::', socket.handshake.address)
  socket.on("ADD_MESSAGE",async (message) => {
    const newMessage = new MessageModel(message);
    await newMessage.save();
    io.to(message.to).emit('NEW_MESSAGE', newMessage)
  });
  socket.on("JOIN_ROOM", async (roomId) => {
    socket.join(roomId);
  });
  socket.on('DELETE_MESSAGE', async (id) => {
    try {
      const file = await MessageModel.findByIdAndDelete({_id: id})
      socket.emit('MESSAGE_DELETED', file)
    } catch (e) {
      socket.emit('errorEvent', {message: 'Delete Error Occured', error: e.message})
    }
  })
  socket.on('liveChat', (roomId, userName, content)=> {
    liveChatObject[roomId] = {...liveChatObject[roomId], [userName]: content}
    io.to(roomId).emit('liveMessages', liveChatObject[roomId])
  })
  socket.on('liveChatHandler',async (roomId, liveStatus) => {
    const result = await RoomModel.findOneAndUpdate(
      { roomId },
      { $set: { liveChatEnabled: !liveStatus }},
      { returnOriginal: false }
    );
    io.to(roomId).emit('liveChatStatusUpdate', result)
  })
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
