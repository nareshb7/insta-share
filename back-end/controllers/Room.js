const MessageModel = require("../models/MessageModel")
const RoomModel = require("../models/RoomModel")

module.exports.createRoom = async (req,res)=> {
    try {
        const {params} = req.body
        console.log('CREATE_ROOM::', params)
        const isExist = await RoomModel.findOne({roomId: params.roomId})
        if (isExist) {
            throw new Error('Room is already there')
        }
        const newRoom = new RoomModel({...params})
        newRoom.users.push({userName: params.userName})
        await newRoom.save()
        res.status(201).json(newRoom)
    } catch (e) {
        res.status(401).json({error: e.message})
    }
}
module.exports.joinRoom = async (req,res)=> {
    try {
        const {params} = req.body
        console.log('JOIN_ROOM::', params)
        const newRoom =await RoomModel.findOne({roomId: params.roomId})
        if (!newRoom) {
            throw new Error('Room Id not found')
        }
        if (newRoom.isProtected) {
            if (!params.isProtected) {
                throw new Error('This room is protected please prvoide password')
            }
            if (newRoom.password !== params.password) {
                throw new Error('Room password not matching')
            }
        }
        newRoom.users.push({
            userName: params.userName,
        })
        await newRoom.save()
        newRoom.messages = await MessageModel.find({to: params.roomId})
        res.status(200).json(newRoom)
    } catch (e) {
        res.status(401).json({error: e.message})
    }
}
