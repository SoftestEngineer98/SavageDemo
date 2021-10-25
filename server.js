// Importing express
const express = require('express')
//  Now I want to build this express application and make it fast
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection;
const url = "mongodb+srv://SoftestEngineer:fFERzND6Q8YBoU13@cluster0.qk3nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "thumbsDown";

// telling the application to listen on 3000
app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

//  setting up to use my server side (ejs)
app.set('view engine', 'ejs');
//  telling the app to use these things; crossed out = debercated (not supported)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json())
// app.use(express.urlencoded())
// any of our static files --> As long as they're in a public folder they'll work
//  no need to explicity create routes for each static file
app.use(express.static('public'));

//  routes and the '/' is the homepage 
app.get('/', (req, res) => {
  //  app goes to DB and finds all documents in messages collection then turn them into an array
  console.log('index page')
  // before the slash goes to the homepage it is going to go to mangodb and messages and find the array 
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err);
    //  then go into index.ejs
    res.render('index.ejs', { messages: result });
  });
});

//  messages are the end point
app.post('/messages', (req, res) => {
  // console.log("success")
  db.collection('messages').insertOne(
    { 
      name: req.body.name, 
      msg: req.body.msg, 
      count: 0 
    }, 
    (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/');
    }
  );
});

app.put('/upVote', (req, res) => {
//  A ternary a one line conditional so it needs something to line (++  positive)
//  A ternary opporator 
  // req.body.plus ? req.body.thumbUp++ : req.body.thumbUp--
  db.collection('messages').findOneAndUpdate(
    { name: req.body.name, msg: req.body.msg }, 
    {
      $set: {
        count: req.body.count + 1, 
      },
    }, 
    {
      sort: { _id: -1 },
      upsert: true,
    }, 
    (err, result) => {
      if (err) return res.send(err);
      console.log(result);
      res.send(result);
    }
  );
});

app.put('/downVote', (req, res) => {
  db.collection('messages').findOneAndUpdate(
    { name: req.body.name, msg: req.body.msg }, 
    {
      $set: {
        count: req.body.count - 1, 
      },
    }, 
    {
      sort: { _id: -1 },
      upsert: true,
    }, 
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete(
    { name: req.body.name, msg: req.body.msg }, 
    (err, result) => {
      if (err) return res.send(500, err);
    res.send('Message deleted!');
    }
  );
});
