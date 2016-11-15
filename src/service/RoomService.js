const Room = require('../model/room.js');

module.exports = {
  createRoom() {
    return new Room();
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

};
