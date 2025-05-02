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
    //console.log("(test 4&5&6)succesfully fetced all users from database");
  })
  .catch((err)=>{
    res.json({ error: err})
    console.log("(test 4&5&6)failed to fetch all users from database");
  });
});

app.get("/api/e", async (req, res)=>{
  await Exercise.find({})
  .then((data)=>{
    res.json({ exercise: data})
    //console.log("(mine)succesfully fetched all exercises from database ");
  })
  .catch((err)=>{
    res.json({ error: err})
    console.log("(mine)failed to fetch all exercises from database");
  });
});

app.post("/api/users", async (req, res)=>{
  const user = new User({
    username: req.body.username,
    count: 0
  })
  await user.save()
  .then((data)=>{
    res.json({ username: data.username, _id: data._id });
    //console.log("(test 2&3)new user successfully saved => id: "+data._id+"username: "+data.username);
  })
  .catch(async() => {
    await User.findOne({ username: req.body.username })
    .then((data)=>{
      res.json({ username: data.username, _id: data._id });
      //console.log("(test 2$3)this user already existed => id: "+data._id+"username: "+data.username);
    })
    .catch((err)=>{
      res.status(400).json({ error: err.message });
      console.log("(test 2&3)new user not successfully saved => id: "+data._id+"username: "+data.username);
    })
  }
);
})

app.delete("/api/users/dOne/:id",async (req, res)=>{
  id=req.params.id;
  await User.findByIdAndDelete(id)
  .then((data)=>{
    res.json({ success: data})
    //console.log("(mine)one user deleted succeeded.")
  })
  .catch(err => {
    res.json({ failed: "no such user id"})
    console.log("(mine)delete failed.")
  });
});

app.post("/api/users/:_id/exercises",async(req, res)=>{
 // console.log("\n\ntest 8 enterance............")
  let mycount;
  const id=req.params._id;
  await User.findById(id)
  .then(async dat => {
    mycount = dat.count+1;
    await User.findOneAndUpdate({ _id: id }, { count: mycount }, { new: true });
   // console.log("count from data: "+mycount);
  })
  .catch(err => {
      console.log("error count from data: "+err);
  });
  await User.findById(id)
  .then(async(user) => {
    let date = req.body.date
   // console.log("inserted date: "+date)
   if (!date) {
      date = new Date();
    } else {
      date = new Date(date);
    }
   // console.log("saved date: "+date)
    const exercise = new Exercise({
      user: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: date,
      userId: id
    });
    await exercise.save()
    .then((data)=>{
      date = new Date(data.date).toDateString();
       res.json({
         _id: id,
         username: data.user,
         date: date,
         duration: data.duration,
         description: data.description
      })
      //console.log("(test 8)exersise inserted for: "+data.user+"who has _id: "+data._id+"\n\n");
    })
    .catch((err)=>{
      res.json({ error: err });
      console.log("(test 8)error saving exersice: "+err+"\ndate entered: "+date+"\n exersise details: "+exercise+"\n\n");
    })
  })
  .catch((err) => {
    res.send(err);
    console.log(err);
  });
});


app.get("/api/users/:_id/logs",async(req,res)=>{
  console.log("\ntest 9-16 entry..... ");
  await User.findById(req.params._id)
  .then( async (data1) =>{
    
    const { from, to, limit } = req.query;

    await Exercise.find({ 
      userId: req.params._id,
      date: {
        /* if from is not available we pass in a fallback that starts from a time 
         am sure all exercise will be fetched*/
        $gte: new Date(from || new Date("1000-01-01").toDateString()),
        /* if to is not available we pass in a fallback that ends with the current date so
         am sure all exercise will be fetched*/
        $lte: new Date( to || new Date())
      }
    }).limit( limit || 0 )
    .then((data2)=>{
      let logArr = []
      data2.forEach( data2 => {
        const date=new Date(data2.date).toDateString();
        console.log("date in: "+data2.date+"\ndate out: "+date);
        logArr.push({
          description: data2.description,
          duration: data2.duration,
          date: date,
        });
      });
      const result = { 
        username: data1.username,
        count: data1.count,
        _id: req.params._id,
        log: logArr,
      }
      res.json(result);
    })
    .catch(err => {
      res.json({ "exersise not found": err })
      console.log("exersise not found: "+err);
    });
  })
  .catch(err => {
    res.json({ "user not found: ": err })
    console.log("user not found: "+err);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
