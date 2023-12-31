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
    ownerPassword: {
      type: String,
      required: true
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
    liveChatEnabled: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);
module.exports.RoomModel = new mongoose.model("room", roomSchema);
