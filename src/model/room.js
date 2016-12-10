const EventEmitter = require('events');
const QuestionService = require('../service/QuestionService.js');
/**
 * Class used to model the game room
 */
const rooms = new Map();

const DEFAULT_ROUND_TIME = 10000;
const ROUND_BREAK_TIME = 5000;
const DEFAULT_ROUND_MAX = 5;

const STATES = {
  WAITING: 0,
  PLAYING: 1,
  FINISHED: 2,
  CLOSED: 3,
};
const STATE_STRINGS = ['waiting', 'playing', 'finished', 'closed'];

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
    this.emitters = [];
    this.setState(STATES.WAITING);
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
      this.setState(STATES.PLAYING);
      this.curRound = 0;
      QuestionService.transitionRound(this);
    }
  }

  endGame() {
    this.setState(STATES.FINISHED);
    this.emitters.forEach(emitter => emitter.emit('endGame'));
    for (let [id, player] of this.players) {
      player.emitter.emit('endGame', this);
    }
  }

  beginRound(question) {
    this.curQuestion = question;
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: this.roundTime });
    }
    this.emitters.forEach(emitter => emitter.emit('roundBegin', { time: this.roundTime }));
    this.elapsedTime = 0;
    setTimeout(this.updateRoundTime.bind(this), 1000);
  }

  updateRoundTime() {
    this.elapsedTime += 1000;
    if (this.elapsedTime === this.roundTime) {
      this.endRound();
    } else {
      setTimeout(this.updateRoundTime.bind(this), 1000);
    }
  }

  endRound() {
    this.curRound += 1;
    if (this.curRound === this.numRounds) {
      this.endGame();
    } else {
      setTimeout(QuestionService.transitionRound.bind(undefined, this), ROUND_BREAK_TIME);
      for (let [id, player] of this.players) {
        player.emitter.emit('roundEnd', ROUND_BREAK_TIME);
      }
      this.emitters.forEach(emitter => emitter.emit('roundEnd', ROUND_BREAK_TIME));
    }
  }

  addPlayer(player) {
    this.players.set(player.getID(), player);
    this.emitters.forEach(emitter => emitter.emit('playerJoined', player));
  }

  removePlayer(player) {
    if (this.state === STATES.FINISHED) {
      return;
    }
    this.players.delete(player.getID());
    this.emitters.forEach(emitter => emitter.emit('playerLeft', player));
    if (this.players.size === 0) {
      this.setState(STATES.CLOSED);
    }
  }

  setScore(player) {
    this.emitters.forEach(emitter => emitter.emit('setScore', player));
  }

  getPlayers() {
    return this.players;
  }

  attachHub(emitter) {
    this.emitters.push(emitter);
    emitter.emit('setState', { state: STATE_STRINGS[this.state] })
    emitter.emit('hubAttached', this);
    for (let [id, player] of this.players) {
      emitter.emit('playerJoined', player);
    }
    if (this.state === STATES.PLAYING) {
      emitter.emit('roundBegin', { time: this.roundTime - this.elapsedTime });
    }
  }

  setAdmin(player) {
    this.admin = player;
    player.emitter.emit('setAdmin');
  }

  setState(state) {
    this.state = state;
    const data = { state: STATE_STRINGS[state] };
    this.emitters.forEach(emitter => emitter.emit('setState', data));
    for (let [id, player] of this.players) {
      player.emitter.emit('setState', data);
    }
  }

  getAdmin() {
    return this.admin;
  }

  hasHub() {
    return this.attachedHub;
  }

  isOpen() {
    return this.state !== STATES.CLOSED;
  }

  deattachHub(emitter) {
    this.emitters = this.emitters.splice(this.emitters.indexOf(emitter), 1);
  }

  getCurrentQuestion() {
    return this.curQuestion;
  }

  getID() {
    return this.id;
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
