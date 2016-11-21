const EventEmitter = require('events');
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
    this.attachedHub = false;
    rooms.set(this.id, this);
    this.emitter = new EventEmitter();
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
    this.emitter.emit('roundEnd', ROUND_BREAK_TIME);
  }

  beginRound(question) {
    this.curQuestion = question;
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: ROUND_TIME });
    }
    this.emitter.emit('roundBegin', { time: ROUND_TIME });
    setTimeout(this.endRound.bind(this), ROUND_TIME);
  }

  addPlayer(player) {
    this.players.set(player.getID(), player);
    this.emitter.emit('playerJoined', player);
  }

  removePlayer(player) {
    this.players.delete(player.getID());
    this.emitter.emit('playerLeft', player);
  }

  attachHub(emitter) {
    this.attachedHub = true;
    this.emitter = emitter;
    this.emitter.emit('hubAttached', this);
    for (let [id, player] of this.players) {
      this.emitter.emit('playerJoined', player);
    }
  }

  hasHub() {
    return this.attachedHub;
  }

  deattachHub() {
    this.emitter = new EventEmitter();
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
