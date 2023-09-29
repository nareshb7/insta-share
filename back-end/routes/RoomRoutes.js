const {Router} = require('express')
const { createRoom, joinRoom, publicRooms, liveChatHandler } = require('../controllers/Room')

const router = Router()

router.post('/createroom', createRoom)
router.post('/joinroom', joinRoom)
router.get('/publicrooms', publicRooms)
router.post('/live-chat', liveChatHandler)
module.exports = router