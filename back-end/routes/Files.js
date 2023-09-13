const router = require('express').Router()
const multer = require('multer');
const { downloadFile, uploadFile } = require('../controllers/Files')
const storage = multer.memoryStorage()
const upload = multer({ storage });

router.get('/:id',downloadFile)
router.post("/",upload.single('file'), uploadFile)


module.exports = router