var express = require('express');
var app = express();


app.set('view engine', 'ejs');
app.use(express.static('./public'));

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

app.listen(8080);
console.log('Server is listening on port 8080');