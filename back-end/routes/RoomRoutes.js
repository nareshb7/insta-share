const {Router} = require('express')
const { createRoom, joinRoom } = require('../controllers/Room')

const router = Router()

router.post('/createroom', createRoom)
router.post('/joinroom', joinRoom)

module.exports = router