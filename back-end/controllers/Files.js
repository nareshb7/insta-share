const mongoose = require('mongoose')

const supportedFormats = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-zip-compressed',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/rtf',
  ];

const fileSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        requried: true
    },
    fileName: {
        type: String,
        requried: true
    },
    size: {
        type:Number,
        requried: true
    },
    type: {
        type: String,
        required: true
    }
})

const FileModel = new mongoose.model('files', fileSchema)

module.exports.uploadFile = async (req,res) => {
    try {
        const { originalname, buffer, size, mimetype } = req.file;
        console.log('FILE::', req.file)
        if (!supportedFormats.find((val) => val.includes(mimetype))) {
            throw new Error('Invalid format')
        }
        if (size > 3145728) {
            throw new Error('More than 3mb not allowed')
        }
        const isExisted = await FileModel.findOne({ data: buffer })
        if (isExisted) {
            res.status(200).json(isExisted)
        } else {
            const newFile = new FileModel({
                fileName: originalname,
                data: buffer,
                size,
                type: mimetype
            })
            await newFile.save()
            res.status(200).json(newFile)
        }
    } catch (e) {
        res.status(400).json({error: e.message})
    }
}
module.exports.downloadFile  = async (req,res) => {
    try {
        console.log('DOWNLOAD::', req.query, req.params)
        const {id} = req.params
        const file = await FileModel.findOne({_id: id})
        res.status(200).json(file)
    } catch (e) {
        res.status(200).json({error: e.message})
    }
}
module.exports.deleteFile = async (req,res) => {
    try {
        res.status(200).json(req.body)
    } catch (e) {
        res.status(200).json({error: e.message})
    }
}