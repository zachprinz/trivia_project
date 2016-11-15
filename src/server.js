const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const PlayerService = require('./service/PlayerService.js');
const RoomService = require('./service/RoomService.js');

const PUBLIC_PATH = path.join(__dirname, '../components');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set the directory where partials will be found
hbs.registerPartials(path.join(PUBLIC_PATH, 'partials'));

// Set our server to use hbs (Handlebar) files to as html templates
app.set('view engine', 'hbs');

// Tell the template engine where to find the template files
app.set('views', path.join(PUBLIC_PATH, 'views'));

// Forward our components folder so it is accessable on the client
app.use(express.static(PUBLIC_PATH));

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
  res.render('player.hbs', { isPlayPage: true, roomNumber: 0 });
});

// Handle HTTP GET requests at root '/hub'
app.get('/hub', (req, res) => {
  // Render the hub template with the isHubPage bool true
  res.render('hub.hbs', { isHubPage: true });
});

io.on('connection', (socket) => {
  const player = PlayerService.createNewPlayer();

  player.emitter.on('roomJoined', (data) => {
    socket.emit('enteredRoom', data);
  });

  player.emitter.on('roomJoinFailed', (data) => {
    socket.emit('roomJoinFailed', data);
  });

  player.emitter.on('answerGraded', (answer) => {
    socket.emit('answerGraded', answer.toJSON());
  });

  player.emitter.on('roundBegin', () => {
    socket.emit('roundBegin', player.getRoom().getCurrentQuestion().toJSON());
  });

  player.emitter.on('roundEnd', () => {
    socket.emit('roundEnd');
  });

  socket.on('joinRoom', (data) => {
    RoomService.addPlayerToRoomByID(player, data.roomID);
  });

  socket.on('submitAnswer', (data) => {
    PlayerService.submitAnswer(player, data);
  });

  socket.on('disconnect', () => {
    PlayerService.removePlayer(player);
  });

  // Ensure all event listeners are registered before initializing
  PlayerService.initPlayer(player);
});

// Start the server listening on port 3000
server.listen(PORT, () => {
  console.log('Server started');
});
