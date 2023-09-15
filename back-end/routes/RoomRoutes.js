const {Router} = require('express')
const { createRoom, joinRoom, publicRooms } = require('../controllers/Room')

const router = Router()

router.post('/createroom', createRoom)
router.post('/joinroom', joinRoom)
router.get('/publicrooms', publicRooms)

module.exports = router