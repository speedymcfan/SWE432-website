var express = require('express');
var app = express();

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


main().catch(console.error);

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/song', function(req, res) {
  const result = client.db("radio").collection("music").findOne({current: '1'});
  if(!result){
    console.log('failed');
  } else {
    console.log(result.audio);
    res.send(result.audio);
  }
});

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/index', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.get('/songs', function(req, res) {
    res.render('pages/songs');
});

app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

app.get('/login', function(req, res) {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await client.db("radio").collection("music").findOne({ username });

  if (!user) {
    res.status(401).send('Invalid username or password');
    return;
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).send('Invalid username or password');
    return;
  }

  req.session.userId = user._id;
  res.redirect('/');
});

app.listen(8080);
console.log('Server is listening on port 8080');
