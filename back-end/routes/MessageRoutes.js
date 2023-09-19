const { getRoomMessages, newMessage, deleteFile } = require('../controllers/Message')

const router = require('express').Router()

router.get('/:roomId',getRoomMessages )
router.post('/sendmessage',newMessage)
router.delete('/:id', deleteFile)

module.exports = router