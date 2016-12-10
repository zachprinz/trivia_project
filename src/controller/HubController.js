const RoomService = require('../service/RoomService.js');
const EventEmitter = require('events');

module.exports = {
  listen(socket, requestedRoomID) {
    const emitter = new EventEmitter();
    let curRoom;
    if (requestedRoomID === -1 || !RoomService.findByID(requestedRoomID)) {
      curRoom = RoomService.createRoom();
    } else {
      curRoom = RoomService.findByID(requestedRoomID);
    }

    emitter.on('hubAttached', (room) => {
      curRoom = room;
      socket.emit('hubAttached', curRoom.toJSON());
    });

    emitter.on('roundBegin', (data) => {
      socket.emit('roundBegin', Object.assign(curRoom.getCurrentQuestion().toJSON(), data));
    });

    emitter.on('roundEnd', (breaktime) => {
      socket.emit('roundEnd', { time: breaktime });
    });

    emitter.on('playerJoined', (player) => {
      socket.emit('playerJoined', player.toJSON());
    });

    emitter.on('playerLeft', (player) => {
      socket.emit('playerLeft', player.toJSON());
    });

    emitter.on('setScore', (player) => {
      socket.emit('setScore', player.toJSON());
    });

    emitter.on('endGame', () => {
      socket.emit('endGame');
    });

    emitter.on('setState', (data) => {
      socket.emit('setState', data);
    });

    socket.on('joinRoom', (data) => {
      const prevRoom = curRoom;
      if (RoomService.attachHubToRoomByID(emitter, parseInt(data.roomID, 10))) {
        prevRoom.deattachHub(emitter);
      }
    });

    socket.on('disconnect', () => {
      // Empty
    });

    // Register all listeners before attaching the hub.
    curRoom.attachHub(emitter);
  },
};
