const Room = require('../model/room.js');

module.exports = {
  createRoom() {
    return new Room();
  },

  findByID(id) {
    return Room.findByID(id);
  },

  addPlayerToRoomByID(player, roomID) {
    if (Room.roomExists(roomID)) {
      Room.findByID(roomID).addPlayer(player);
      player.setRoom(Room.findByID(roomID));
      return true;
    }
    player.emitter.emit('roomJoinFailed', {});
    return false;
  },

  attachHubToRoomByID(emitter, roomID) {
    if (Room.roomExists(roomID) && !Room.findByID(roomID).hasHub()) {
      Room.findByID(roomID).attachHub(emitter);
      return true;
    }
    emitter.emit('roomJoinFailed', {});
    return false;
  },

};
