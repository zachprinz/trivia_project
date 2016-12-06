// Assign the player and room services to constant variables for use in the class
const PlayerService = require('../service/PlayerService.js');
const RoomService = require('../service/RoomService.js');

// Export the module so that it's visible to the rest of the application
module.exports = {
  listen(socket) {
    // Create a new player by calling the PlayerService
    const player = PlayerService.createNewPlayer();

    // Listen for roomJoined events
    player.emitter.on('roomJoined', (room) => {
      // Emit a roomJoined event with the room object as a JSON
      socket.emit('roomJoined', room.toJSON());
    });

    // Listen for roomJoinFailed messages
    player.emitter.on('roomJoinFailed', (data) => {
      // Emit a roomJoinFailed message with the data object attached
      socket.emit('roomJoinFailed', data);
    });

    // Listen for answerGraded events
    player.emitter.on('answerGraded', (answer) => {
      // Emit an answer graded event with the answer object as a JSON
      socket.emit('answerGraded', answer.toJSON());
    });

    // Listen for roundBegin messages
    player.emitter.on('roundBegin', (data) => {
      // Emit a round begin evenet wit the room's current question as a JSON
      socket.emit('roundBegin', Object.assign(player.getRoom().getCurrentQuestion().toJSON(), data));
    });

    // Listen for a roundEnd message
    player.emitter.on('roundEnd', (time) => {
      // Emit a round end message with the time object in a JSON
      socket.emit('roundEnd', { 'time': time });
    });

    // Listen for endGame events
    player.emitter.on('endGame', () => {
      // Emit an end game message
      socket.emit('endGame');
    });

    // Listen for joinRoom events
    socket.on('joinRoom', (data) => {
      // Add the player to the room indicated by the room ID
      RoomService.addPlayerToRoomByID(player, parseInt(data.roomID, 10));
    });

    // Listen for submitAnswer messages
    socket.on('submitAnswer', (data) => {
      // Call the playerService wih the player and the answer data
      PlayerService.submitAnswer(player, data);
    });

    // Listen for disconnect messages
    socket.on('disconnect', () => {
      // Call the playerService to remove the given player
      PlayerService.removePlayer(player);
    });

    // Ensure all event listeners are registered before initializing
    PlayerService.initPlayer(player);
  },
};
