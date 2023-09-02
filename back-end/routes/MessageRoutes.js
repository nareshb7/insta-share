const { getRoomMessages, newMessage } = require('../controllers/Message')

const router = require('express').Router()

router.get('/:roomId',getRoomMessages )
router.post('/sendmessage',newMessage)


module.exports = router