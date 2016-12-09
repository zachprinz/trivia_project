const EventEmitter = require('events');
const QuestionService = require('../service/QuestionService.js');
/**
 * Class used to model the game room
 */
const rooms = new Map();

const DEFAULT_ROUND_TIME = 10000;
const ROUND_BREAK_TIME = 2000;
const DEFAULT_ROUND_MAX = 5;

const STATES = {
  WAITING: 0,
  PLAYING: 1,
  FINISHED: 2,
  CLOSED: 3,
};

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
    this.state = STATES.WAITING;
    this.numRounds = DEFAULT_ROUND_MAX;
    this.roundTime = DEFAULT_ROUND_TIME;
  }

  static findByID(id) {
    return rooms.get(id);
  }

  static roomExists(id) {
    return (Room.findByID(id) !== undefined) && Room.findByID(id).isOpen();
  }

  beginGame() {
    if (this.state === STATES.WAITING) {
      this.state = STATES.PLAYING;
      this.curRound = 0;
      QuestionService.transitionRound(this);
    }
  }

  endGame() {
    this.state = STATES.FINISHED;
    for (let [id, player] of this.players) {
      player.emitter.emit('endGame');
      this.removePlayer(player);
    }
  }

  beginRound(question) {
    this.curQuestion = question;
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: this.roundTime });
    }
    this.emitter.emit('roundBegin', { time: this.roundTime });
    setTimeout(this.endRound.bind(this), this.roundTime);
  }

  endRound() {
    this.curRound++;
    if (this.curRound === this.numRounds) {
      this.endGame();
    } else {
      setTimeout(QuestionService.transitionRound.bind(undefined, this), ROUND_BREAK_TIME);
      for (let [id, player] of this.players) {
        player.emitter.emit('roundEnd', ROUND_BREAK_TIME);
      }
      this.emitter.emit('roundEnd', ROUND_BREAK_TIME);
    }
  }

  addPlayer(player) {
    this.players.set(player.getID(), player);
    this.emitter.emit('playerJoined', player);
  }

  removePlayer(player) {
    this.players.delete(player.getID());
    this.emitter.emit('playerLeft', player);
    if (this.players.size === 0) {
      this.state = STATES.CLOSED;
    }
  }

  getPlayers() {
    return this.players;
  }

  attachHub(emitter) {
    this.attachedHub = true;
    this.emitter = emitter;
    this.emitter.emit('hubAttached', this);
    for (let [id, player] of this.players) {
      this.emitter.emit('playerJoined', player);
    }
  }

  setAdmin(player) {
    this.admin = player;
    player.emitter.emit('setAdmin');
  }

  getAdmin() {
    return this.admin;
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

  isOpen() {
    return (this.state !== STATES.CLOSED);
  }

  setNumRounds(numRounds) {
    this.numRounds = numRounds;
  }

  setRoundTime(roundTime) {
    this.roundTime = roundTime;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }

}

module.exports = Room;
