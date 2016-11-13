const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

const QuestionMapper = require('./mapping/QuestionMapper.js');

const app = express();
const port = process.env.PORT || 3000;

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

/**
 * Handle HTTP POST Requests to /answer endpoint
 * Called when the user submits an answer for grading
 * Returns to the user a boolean representing the correctness of the answer
 */
app.post('/answer', (req, res) => {
  // Use ES6 destructuring to pull passed data from the request body
  const { answer, questionId } = req.body;

  // Find the question object the user is answering so we can check it
  QuestionMapper.findByID(questionId).then((question) => {
    // Return a result containing json data with the result (grade)
    res.send({ correct: question.check(answer) });
  }).catch((err) => {
    console.log(err);
  });
});

/**
 * Handle HTTP GET Requests to the /next endpoint
 * Requested when the user needs a new question to be displayed
 * Returns to the user a HTML partial showing the new question
 */
app.get('/next', (req, res) => {
  // Find a random question to send to the user
  QuestionMapper.findAny().then((question) => {
    // Send the user a rendered partial showing the selected question
    res.render('../partials/qa.hbs', question);
  }).catch((err) => {
    console.log(err);
  });
});

// Start the server listening on port 3000
app.listen(port, () => {
  console.log('Server started');
});
