const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    ownerName: {
      required: true,
      type: String,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array,
      default: [],
    },
    messages: {
      type: Array,
      default: [],
    },
    password: String,
  },
  { timestamps: true }
);
module.exports.RoomModel = new mongoose.model("room", roomSchema);
