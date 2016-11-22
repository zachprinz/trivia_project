
// Importing services to be used by the controller
const PlayerService = require('../service/PlayerService.js');
const RoomService = require('../service/RoomService.js');

// Exporting the code within braces to be visible by the entire application
module.exports = {
  // Listen on the socket are using from the playerClient on the front-end
  listen(socket) {
    // Create a new player object
    const player = PlayerService.createNewPlayer();

    // Use the emitter declared in the player class to listen for events with a 'roomJoined' message,
    // and a room object passed in as data.
    player.emitter.on('roomJoined', (room) => {
      // Emit an event with the same roomJoined message and the room object in a JSON form
      socket.emit('roomJoined', room.toJSON());
    });

    // Use the emitter declared in the player class to listen for events with a 'roomFailed' message,
    // and a data object passed in as data.
    player.emitter.on('roomJoinFailed', (data) => {
      // Emit an event with the same roomJoinFailed message and the data object
      socket.emit('roomJoinFailed', data);
    });

    // Use the emitter declared in the player class to listen for events with a 'answerGraded' message,
    // and a answer object passed in as data.
    player.emitter.on('answerGraded', (answer) => {
      // Emit an event with the same answerGraded message and the answer object in a JSON form
      socket.emit('answerGraded', answer.toJSON());
    });

    // Use the emitter declared in the player class to listen for events with a 'roundBegin' message,
    // and a data object passed in as data.
    player.emitter.on('roundBegin', (data) => {
      // Emit a message with a roundBeing message, a JSON representing the question, and the data objeect
      socket.emit('roundBegin', Object.assign(player.getRoom().getCurrentQuestion().toJSON(), data));
    });

    // Use the emitter declared in the player class to listen for events with a 'roundEnd' message,
    // and a time object passed in as data.
    player.emitter.on('roundEnd', (time) => {
      // Emit a message with the same roundEnd message and a time JSON
      socket.emit('roundEnd', { 'time': time });
    });

     // Use the emitter declared in the player class to listen for events with a 'endGame' message
    player.emitter.on('endGame', () => {
      // Emit the endGame message to the player client
      socket.emit('endGame');
    });
    
    // Listen for joinRoom events with data passed in as an argument
    socket.on('joinRoom', (data) => {
      // Call the room service to add the player 
      RoomService.addPlayerToRoomByID(player, parseInt(data.roomID, 10));
    });

    // Listen for submitAnswer events with data passed in as an argument
    socket.on('submitAnswer', (data) => {
      // Call the player service with the player and data objects
      PlayerService.submitAnswer(player, data);
    });

    // Listen for disconnect events
    socket.on('disconnect', () => {
      // Call the player service to remove the players from the room
      PlayerService.removePlayer(player);
    });

    // Ensure all event listeners are registered before initializing
    PlayerService.initPlayer(player);
  },
};
