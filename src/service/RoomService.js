// Constant variable to hold the room model
const Room = require('../model/room.js');

// Export the room service module so that it's visible to the entire application
module.exports = {
  // Create a new room
  createRoom() {
    return new Room();
  },

  findByID(id) {
    return Room.findByID(id);
  },

  // Function to add a player to a room
  addPlayerToRoomByID(player, roomID) {
    // Conditional that checks whether a room exists
    if (Room.roomExists(roomID)) {
      // Find the room by its ID and add the player to it
      Room.findByID(roomID).addPlayer(player);
      player.setRoom(Room.findByID(roomID));
      return true;
    }
    // Emit a message saying that joining the room has failed
    player.emitter.emit('roomJoinFailed', {});
    return false;
  },

  // Function to attach a hub to rooom based on the rooms ID
  attachHubToRoomByID(emitter, roomID) {
    // Conditional that checks whether the room exists and if it does, whether it has a hub alreaday
    if (Room.roomExists(roomID) && !Room.findByID(roomID).hasHub()) {
      // Attach the hub to the room
      Room.findByID(roomID).attachHub(emitter);
      return true;
    }
    // Emit a message that joining the room has failed
    emitter.emit('roomJoinFailed', {});
    return false;
  },

};
