const QuestionService = require('../service/QuestionService.js');
/**
 * Class used to model the game room
 */
const rooms = new Map();

const ROUND_TIME = 6000;
const ROUND_BREAK_TIME = 2000;

const getNewRoomID = (() => {
  let curID = 0;
  return () => {
    curID += 1;
    return curID;
  };
})();

class Room {

  constructor() {
    this.id = getNewRoomID();
    this.players = new Map();
    rooms.set(this.id, this);
    QuestionService.transitionRound(this);
  }

  static findByID(id) {
    return rooms.get(id);
  }

  static roomExists(id) {
    return Room.findByID(id) !== undefined;
  }

  endRound() {
    setTimeout(QuestionService.transitionRound.bind(undefined, this), ROUND_BREAK_TIME);
    for (let [id, player] of this.players) {
      player.emitter.emit('roundEnd', ROUND_BREAK_TIME);
    }
  }

  beginRound(question) {
    this.curQuestion = question;
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: ROUND_TIME });
    }
    setTimeout(this.endRound.bind(this), ROUND_TIME);
  }

  addPlayer(player) {
    this.players.set(player.getID(), player);
  }

  removePlayer(player) {
    this.players.delete(player.getID());
  }

  getCurrentQuestion() {
    return this.curQuestion;
  }

  getID() {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }

}

module.exports = Room;
