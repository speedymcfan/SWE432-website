var express = require('express');
var app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://anandmure:pzfcvb123@swe432.tt2c69k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function main(){

  try {
    await client.connect();

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}


client.connect();


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('song', function(req, res) {
  const result = client.db("radio").collection("music").findOne({current: '1'});
  if(!result){
    console.log('failed');
  } else {
    console.log(result.audio);
    res.send(result.audio);
  }
});

app.get('/', async (req, res) => {
  const song = await client.db("radio").collection("music").findOne({ current: '1'});
  res.render('pages/index', { song });
});

app.get('/index', async (req, res) => {
  const song = await client.db("radio").collection("music").findOne({ current: '1'});
  res.render('pages/index', { song });
});


app.get('/songs', async (req, res) => {
  const song1 = await client.db("radio").collection("music").findOne({ current: '1'});
  const songs = await client.db("radio").collection("music").find({}).toArray();
  res.render('pages/songs', { song1, songs });
});

app.get('/contact', async (req, res) => {
  const song = await client.db("radio").collection("music").findOne({ current: '1'});
  res.render('pages/contact', { song });
});

app.get('/login', async(req, res) => {
  const song = await client.db("radio").collection("music").findOne({ current: '1'});
  res.render('pages/login', { song });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await client.db("radio").collection("logins").findOne({ username });

  if (!user) {
    res.status(401).send('Invalid username or password');
    return;
  }

  const isPasswordInvalid = await password.localeCompare(user.password);

  if (isPasswordInvalid) {
    res.status(401).send('Invalid username or password');
    return;
  }

  if (!user.type.localeCompare("dj")) {
    res.redirect('/dj-login');
  } else {
    res.redirect('/user-login');
  }
  
});

app.get('/dj-login', async (req, res) => {
  const song1 = await client.db("radio").collection("music").findOne({ current: '1'});
  const songs = await client.db("radio").collection("music").find({}).toArray();
  res.render('pages/dj-login', { song1, songs });
});

app.post('/server.js', async (req, res) => {
  const itemId = req.body.itemId;
  await client.db("radio").collection("music").updateOne({ current: '1' }, {$set: {current: '0'}});
  await client.db("radio").collection("music").updateOne({ title: itemId }, {$set: {current: '1'}});
})

app.get('/user-login', async (req, res) => {
  const song = await client.db("radio").collection("music").findOne({ current: '1'});
  res.render('pages/user-login', { song });
});


app.listen(8080);
console.log('Server is listening on port 8080');
