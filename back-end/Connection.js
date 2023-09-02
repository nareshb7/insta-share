const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log('MONGODB CONNECTED'))
.catch(err => console.log('ERROR: MONGODB CONNECTION'))