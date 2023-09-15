const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: String,
    from: String,
    to: String,
    time: String,
    date: String,
    type:String,
    fileId: String
}, {timestamps: true})

module.exports = MessageModel = new mongoose.model('message', messageSchema)