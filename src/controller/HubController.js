// Assign variables to the old the event emitter and room service
const RoomService = require('../service/RoomService.js');
const EventEmitter = require('events');

// Export the module so that it is visible to the entire application
module.exports = {
  listen(socket, requestedRoomID) {
    // Create an event emitter and a current room
    const emitter = new EventEmitter();
    let curRoom;
    if (requestedRoomID === -1 || !RoomService.findByID(requestedRoomID)) {
      curRoom = RoomService.createRoom();
    } else {
      curRoom = RoomService.findByID(requestedRoomID);
    }

    // Listen for hubAttached events
    emitter.on('hubAttached', (room) => {
      // Set the current room to the passed in room from the message
      curRoom = room;
      // Emit a hubattached message with the room as a JSON
      socket.emit('hubAttached', curRoom.toJSON());
    });

    // Listen for roundBegin events
    emitter.on('roundBegin', (data) => {
      // Emit a roundBegin message and with the roms current question as a JSON
      socket.emit('roundBegin', Object.assign(curRoom.getCurrentQuestion().toJSON(), data));
    });

    // Listen for roundEnd events
    emitter.on('roundEnd', (breaktime) => {
      // Emit a roundEnd event with the time as a JSON
      socket.emit('roundEnd', { time: breaktime });
    });

    // Listen for a playerJoined event
    emitter.on('playerJoined', (player) => {
      // Emit a playerJoined message with the player object as a JSON
      socket.emit('playerJoined', player.toJSON());
    });

    // Listen for playerLeft messages
    emitter.on('playerLeft', (player) => {
      // Emit a playerLeft message and a player object as a JSON
      socket.emit('playerLeft', player.toJSON());
    });

    emitter.on('setScore', (player) => {
      socket.emit('setScore', player.toJSON());
    });

    // Listen for an endGame event
    emitter.on('endGame', () => {
      // Broadcase the endGame event to the hub.
      socket.emit('endGame');
    });

    // Listen for a setState event
    emitter.on('setState', (data) => {
      // Broadcast the setState event to the hub.
      socket.emit('setState', data);
    });

    // Listen for a joinRoom event
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
