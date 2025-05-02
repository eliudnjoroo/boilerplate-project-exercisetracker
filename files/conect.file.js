const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas first
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true }
});

const exerciseSchema = new mongoose.Schema({
  userId : { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true }
});

// Define models
const Myuser = mongoose.model('Myuser', userSchema);
const Exercise = mongoose.model('Exercises', exerciseSchema);

// Connect and clear database
mongoose.connect(process.env.CON_STRING)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear collections if they exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (collectionNames.includes('myusers')) {
      // await Myuser.collection.drop();
      // console.log('Myuser collection dropped');
    }

    if (collectionNames.includes('exercises')) {
      // await Exercise.collection.drop();
      // console.log('Exercise collection dropped');
    }

    // Optionally, you could recreate indexes now or seed initial data here

  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

module.exports = { Myuser, Exercise };
