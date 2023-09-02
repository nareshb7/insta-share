const MessageModel = require("../models/MessageModel")


module.exports.getRoomMessages =async (req,res)=> {
    try {
        const{roomId} = req.query
        const allMessages = new MessageModel.find({to: roomId})
        res.status(201).json(allMessages)
    } catch (e) {
        res.status(404).json({error: e.message})
    }
}

module.exports.newMessage = async (req,res) => {
    try {
        const {message} = req.body
        const newMessage = new MessageModel({...message})
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch (e) {
        res.status(401).json({error: e.message})
    }
}