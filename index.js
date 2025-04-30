const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const User = require('./files/conect.file.js').Myuser;
const Exercise = require('./files/conect.file.js').Exercise;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/users", async (req, res)=>{
  await User.find({})
  .then((data)=>{
    res.json(data)
    console.log("succesfully read data from database ");
  })
  .catch((err)=>{
    res.json({ error: err})
    console.log("failed to read from database");
  });
});

app.get("/api/e", async (req, res)=>{
  await Exercise.find({})
  .then((data)=>{
    res.json({ exercise: data})
    console.log("succesfully read data from database ");
  })
  .catch((err)=>{
    res.json({ error: err})
    console.log("failed to read from database");
  });
});

app.post("/api/users", async (req, res)=>{
  const user = new User({
    username: req.body.username
  })
  await user.save()
  .then((data)=>{
    res.json({ username: data.username, _id: data._id });
    console.log("User successfully saved ");
  })
  .catch(async() => {
    await User.findOne({ username: req.body.username })
    .then((data)=>{
      res.json({ username: data.username, _id: data._id });
      console.log("User already existed ");
    })
    .catch((err)=>{
      res.status(400).json({ error: err.message });
      console.log("User not successfully saved.");
    })
  }
);
})


app.delete("/api/users/dOne/:id",async (req, res)=>{
  id=req.params.id;
  await User.findByIdAndDelete(id)
  .then((data)=>{
    res.json({ success: data})
    console.log("delete succeeded.")
  })
  .catch(err => {
    res.json({ failed: "no such user id"})
    console.log("delete failed.")
  });
});


app.post("/api/users/:_id/exercises",async(req, res)=>{
  const id=req.params._id;
  await User.findById(id)
  .then(async(user) => {
    let date = req.body.date
    if(date == ""){ date=new Date(); }
    const exercise = new Exercise({
      user: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: date
    });
    await exercise.save()
    .then((data)=>{
      date = new Date(data.date).toDateString();
      console.log("data after insert exersise: "+date);
       res.json({
         _id: data._id,
         username: data.user,
         date: date,
         duration: data.duration,
         description: data.description
      })
      res.json({data: exercise})
    })
    .catch((err)=>{
      console.log("error saving exersice: "+err);
    })
  })
  .catch((err) => {
    res.send(err);
    console.log(err);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
