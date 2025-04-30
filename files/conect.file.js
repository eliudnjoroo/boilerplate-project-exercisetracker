const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CON_STRING)
.then(()=>{ console.log('Connected to MongoDB') })
.catch((err)=>{ console.error('Connection error:', err) });

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true }
},
{ 
  timestamps: true 
}
);

const exerciseSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true }
},
{
  timestamps: true
}
);

let Myuser = mongoose.model('Myuser',userSchema);
let Exercise = mongoose.model('Exercises',exerciseSchema);

module.exports = { Myuser, Exercise };