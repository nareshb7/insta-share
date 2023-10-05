const MessageModel = require("../models/MessageModel");
const { RoomModel } = require("../models/RoomModel");

module.exports.createRoom = async (req, res) => {
  try {
    const { params } = req.body;
    console.log("CREATE_ROOM::", params);
    const newRoom = new RoomModel({
      ...params,
      ownerName: params.userName,
      ownerPassword: params.userPassword,
    });

    newRoom.users.push({
      userName: params.userName.split(";")[0],
      ipAddress: req.ip,
      joinedDate: new Date(),
    });
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
    console.log("JOIN_ROOM::", params, req.ip);
    const { roomId, password, userName, isNewUser, isProtected } = params;
    const newRoom = await RoomModel.findOne({ roomId: roomId });
    if (!newRoom) {
      throw new Error("Room Id not found");
    }
    if (newRoom.isProtected) {
      if (!isProtected) {
        throw new Error("This room is protected please prvoide password");
      }
      if (newRoom.password !== password) {
        throw new Error("Room password not matching");
      }
    }
    const isExistedUser = newRoom.users.find(
      (val) => val.userName === userName.split(";")[0]
    );
    if (isExistedUser && newRoom.ownerName === userName.split(";")[0]) {
      const ownerPassword = userName.split(";")[1];
      if (!ownerPassword) {
        throw new Error("Owner account needs password to login");
      }
      if (ownerPassword !== newRoom.ownerPassword) {
        throw new Error("Owner account password is not matching");
      }
    }
    if (isExistedUser && isNewUser) {
      throw new Error("Someone has already joined with same User name");
    } else if (isNewUser && !isExistedUser) {
      newRoom.users.push({
        userName: userName.split(";")[0],
        ipAddress: req.ip,
        joinedDate: new Date(),
      });
    } else if (!isNewUser && !isExistedUser) {
      throw new Error("There is no member with such user name");
      
    }
    
    await newRoom.save();
    newRoom.messages = await MessageModel.find({ to: roomId });
    res.status(200).json(newRoom);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

module.exports.publicRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find({ isProtected: false });
    res.status(200).json(rooms);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports.liveChatHandler = async (req, res) => {
  try {
    const { liveChatEnabled, roomId } = req.body;
    const result = await RoomModel.findOneAndUpdate(
      { roomId },
      { $set: { liveChatEnabled: !liveChatEnabled } },
      { returnOriginal: false }
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
