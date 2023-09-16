const MessageModel = require("../models/MessageModel");
const { RoomModel } = require("../models/RoomModel");

module.exports.createRoom = async (req, res) => {
  try {
    const { params } = req.body;
    console.log("CREATE_ROOM::", params);
    const newRoom = new RoomModel({ ...params });

    newRoom.users.push({ userName: params.userName });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (e) {
    if (e.message.includes("roomId_1")) {
      return res
        .status(401)
        .json({ error: "Try new Room Id..., Its already using" });
    }
    res.status(401).json({ error: e.message });
  }
};
module.exports.joinRoom = async (req, res) => {
  try {
    const { params } = req.body;
    console.log("JOIN_ROOM::", params, req.url);
    const newRoom = await RoomModel.findOne({ roomId: params.roomId });
    if (!newRoom) {
      throw new Error("Room Id not found");
    }
    if (newRoom.isProtected) {
      if (!params.isProtected) {
        throw new Error("This room is protected please prvoide password");
      }
      if (newRoom.password !== params.password) {
        throw new Error("Room password not matching");
      }
    }
    const isExistedUser = newRoom.users.find(val => val.userName === params.userName)
    if (isExistedUser && params.isNewUser) {
      throw new Error("Someone has already joined with same User name");
    } else if (params.isNewUser && !isExistedUser) {
      newRoom.users.push({
        userName: params.userName,
      });
    } else if (!params.isNewUser && !isExistedUser) {
      throw new Error("There is no member with such user name");
      
    }
    
    await newRoom.save();
    newRoom.messages = await MessageModel.find({ to: params.roomId });
    res.status(200).json(newRoom);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

module.exports.publicRooms =async (req,res) => {
  try {
    const rooms = await RoomModel.find({isProtected: false})
    res.status(200).json(rooms)
  } catch (e) {
    res.status(400).json({error: e.message})
  }
}
