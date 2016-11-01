const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const QuestionMapper = require('./mapping/QuestionMapper.js');

const app = express();

// Set the directory where partials will be found
hbs.registerPartials(path.join(__dirname, '/../components/partials'));

// Set our server to use hbs (Handlebar) files to as html templates
app.set('view engine', 'hbs');

// Tell the template engine where to find the template files
app.set('views', path.join(__dirname, '/../components/views'));

// Forward our components folder so it is accessable on the client
app.use(express.static(path.join(__dirname, '/../components')));

// Use bodyParser to parse the bodies of incomming requests
app.use(bodyParser.json());

// Handle HTTP GET requests at root '/'
app.get('/', (req, res) => {
  // Render the home template with the isHomePage bool true
  res.render('home.hbs', { isHomePage: true });
});

// Handle HTTP GET requests at root '/play'
app.get('/play', (req, res) => {
  // Render the player template with the isPlayPage bool true
  res.render('player.hbs', { isPlayPage: true });
});

// Handle HTTP GET requests at root '/hub'
app.get('/hub', (req, res) => {
  // Render the hub template with the isHubPage bool true
  res.render('hub.hbs', { isHubPage: true });
});

app.post('/answer', (req, res) => {
  const { answer, questionId } = req.body;
  QuestionMapper.findByID(questionId).then((question) => {
    res.send({ correct: question.check(answer) });
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/next', (req, res) => {
  QuestionMapper.findAny().then((question) => {
    res.render('../partials/qa.hbs', question);
  }).catch((err) => {
    console.log(err);
  });
});

app.listen(3000, () => {
  console.log('Server started');
});
