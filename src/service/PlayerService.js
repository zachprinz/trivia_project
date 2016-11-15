const Player = require('../model/player.js');
const Answer = require('../model/answer.js');
const RoomService = require('./RoomService.js');

module.exports = {

  createNewPlayer() {
    return new Player();
  },

  initPlayer(player) {
    const room = RoomService.createRoom();
    RoomService.addPlayerToRoomByID(player, room.getID());
  },

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
