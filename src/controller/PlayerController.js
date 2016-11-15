const PlayerService = require('../service/PlayerService.js');
const RoomService = require('../service/RoomService.js');

module.exports = {
  listen(socket) {
    const player = PlayerService.createNewPlayer();

    player.emitter.on('roomJoined', (room) => {
      socket.emit('roomJoined', room.toJSON());
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
      RoomService.addPlayerToRoomByID(player, parseInt(data.roomID, 10));
    });

    socket.on('submitAnswer', (data) => {
      PlayerService.submitAnswer(player, data);
    });

    socket.on('disconnect', () => {
      PlayerService.removePlayer(player);
    });

    // Ensure all event listeners are registered before initializing
    PlayerService.initPlayer(player);
  },
};
