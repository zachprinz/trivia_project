const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var QuestionMapper = require('./mapping/QuestionMapper.js');

var app = express();

// Set the directory where partials will be found
hbs.registerPartials(__dirname + '/../components/partials');

// Set our server to use hbs (Handlebar) files to as html templates
app.set('view engine', 'hbs');
// Tell the template engine where to find the template files
app.set('views', __dirname + '/../components/views');

app.use(express.static(__dirname + '/../components'));

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
  QuestionMapper.findAny().then(function(question) {
    res.render('player.hbs', question);
  });
});

// Handle HTTP GET requests at root '/hub'
app.get('/hub', function(req, res) {
  res.render('hub.hbs');
});

app.post('/answer', function(req, res) {
  var {answer, question_id} = req.body;
  QuestionMapper.findByID(question_id).then(function(question) {
    res.send({correct: question.check(answer)});
  }, function(err) {console.log(err)});
});

app.get('/next', function(req, res) {
  QuestionMapper.findAny().then(function(question) {
    console.log('found next q');
    res.render('../partials/qa.hbs', question);
  }, function(err) {console.log(err)});
  // Respond with the next question and answer
});

app.listen(3000, function() {
  console.log('Server started');
});
