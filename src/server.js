const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var {mongoose} = require('./model/db');
var {Question} = require('./model/question.js');

var app = express();

// Set the directory where partials will be found
hbs.registerPartials(__dirname + '/../components/partials');

// Set our server to use hbs (Handlebar) files to as html templates
app.set('view engine', 'hbs');
// Tell the template engine where to find the template files
app.set('views', __dirname + '/../components/views');

var url = 'none';
app.use(function(req, res, next) {
  url = req.url;
  next();
});

app.use(bodyParser.json());

// Handle HTTP GET requests at root '/'
app.get('/', function(req, res) {
  res.render('home.hbs');
});

// Handle HTTP GET requests at root '/play'
app.get('/play', function(req, res) {
  Question.find().then(
    // On Succeed
    function(questions) {
      res.render('player.hbs', questions[0]);
    },
    // On Fail
    function(err) {
      console.log('Unable to fetch question', err);
      res.send('Unable to render question');
    }
  )
});


// Handle HTTP GET requests at root '/hub'
app.get('/hub', function(req, res) {
  res.render('hub.hbs');
});

app.post('/_answer', function(req, res) {
  // Use mongoose to validate an answer schema and handle valid/invalid answer
  console.log('Users Answer');
  console.log(req.body);
});

app.post('/_next', function(req, res) {
  // Respond with the next question and answer
})

app.listen(3000, function() {
  console.log('Server started');
});
