const MessageModel = require("../models/MessageModel");

module.exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const allMessages = await MessageModel.find({ to: roomId });
    res.status(201).json(allMessages);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

module.exports.newMessage = async (req, res) => {
  try {
    const { data } = req.body;
    console.log("NEW_MESSAGE::", req.body);
    const newMessage = new MessageModel(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

module.exports.deleteFile = async (req,res) => {
  try {
      const {id} = req.params
      const deleteFile = await MessageModel.findByIdAndDelete({_id: id})
      res.status(200).json(req.body)
  } catch (e) {
      res.status(200).json({error: e.message})
  }
}