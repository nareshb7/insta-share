const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log('MONGODB CONNECTED'))
.catch(err => console.log('ERROR: MONGODB CONNECTION'))
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   // Connected to MongoDB Atlas

//   // Drop the entire database
//   mongoose.connection.db.dropDatabase((err) => {
//     if (err) {
//       console.error('Error dropping database:', err);
//     } else {
//       console.log('Database dropped successfully');
//     }
    
//     // Close the Mongoose connection
//     mongoose.connection.close();
//   });
// });
// RoomModel.collection.drop((err) => {
//   if (err) {
//     console.error('Error dropping collection:', err);
//   } else {
//     console.log('Collection dropped successfully');
//   }
// });
