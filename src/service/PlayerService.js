// Constant values that hold the models and service
const Player = require('../model/player.js');
const Answer = require('../model/answer.js');
const RoomService = require('./RoomService.js');

// Export the module so that it's visible to the entire application
module.exports = {

  // Function that creates a new player
  createNewPlayer() {
    return new Player();
  },

  // Function that creates a room and adds a player to it
  initPlayer(player) {
    const room = RoomService.createRoom();
    RoomService.addPlayerToRoomByID(player, room.getID());
    room.setAdmin(player);
  },

  // Function that removes a player
  removePlayer(player) {
    player.getRoom().removePlayer(player);
  },

  /**
   * Handle 'submitAnswer' events emitted from a client
   * Called when the user submits an answer for grading
   * Returns to the user a boolean representing the correctness of the answer
   */
  submitAnswer(player, answerData) {
    const { answer } = answerData;
    const answerObj = new Answer(answer);
    const question = player.getRoom().getCurrentQuestion();
    answerObj.grade(question);
    player.addAnswer(answerObj);
  },
};
