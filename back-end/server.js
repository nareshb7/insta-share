const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./Connection')
const roomRoutes = require('./routes/RoomRoutes')
const messageRoutes = require('./routes/MessageRoutes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

const PORT = process.env.PORT || 8082
const server = http.createServer(app)


const dt = ['Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ','Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ','Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ', 'ofc', 'ok']
app.get('/', (req,res)=> {
    res.json('Welcome to the file share project')
})
app.get('/getmessages', (req,res)=> {
    res.status(200).json(dt)
})
app.post('/addMessage', (req,res)=> {
    const {message} = req.body
    console.log('MSZ::', message, req.body)
    dt.push(message)
    res.status(200).json(message)
})
app.use('/room', roomRoutes)
app.use('/message', messageRoutes)

server.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})




