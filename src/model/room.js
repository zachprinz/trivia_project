// Assign an event emitter to the constant variable
const EventEmitter = require('events');
// Assign the questionService to the constatn variable
const QuestionService = require('../service/QuestionService.js');

 // Create a map to hold the rooms
const rooms = new Map();

// Set constant values for round time, break between rounds, and default number of rounds
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

// Funcion that returns the room id
const getNewRoomID = (() => {
  let curID = 0;
  return () => {
    curID += 1;
    return curID;
  };
})();

/**
 * Class used to model the game room
 */
class Room {

// Constructor that set the values of the object
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

  // Static function to find a room by its ID
  static findByID(id) {
    return rooms.get(id);
  }

  // Static function that checks for an existing room based on its ID
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

  // Function that is called when the game is over
  endGame() {
    this.setState(STATES.FINISHED);
    this.emitters.forEach(emitter => emitter.emit('endGame'));
    // For-Each loop that emits a message to each player that the game is over and removes the player from the room
    for (let [id, player] of this.players) {
      player.emitter.emit('endGame', this);
    }
  }

  // Function that is called to begin a round
  beginRound(question) {
    this.curQuestion = question;
    // For-each loops that emits a message to all players that the round has started
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: this.roundTime });
    }
    // Emits a message to non-players that the round has started
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

  // Function that is called when the round ends
  endRound() {
    // Increment the round count
    this.curRound += 1;
    if (this.curRound === this.numRounds) {
      this.endGame();
    } else {
      setTimeout(QuestionService.transitionRound.bind(undefined, this), ROUND_BREAK_TIME);
      // Emit a message to each player that the round is over
      for (let [id, player] of this.players) {
        player.emitter.emit('roundEnd', ROUND_BREAK_TIME);
      }
      // Emit a message to non-players that the round is over
      this.emitters.forEach(emitter => emitter.emit('roundEnd', ROUND_BREAK_TIME));
    }
  }

  // Function that is called to add a player
  addPlayer(player) {
    this.players.set(player.getID(), player);
    this.emitters.forEach(emitter => emitter.emit('playerJoined', player));
  }

  // Function that is called to remove a player
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

  // Function that is called to attach a hub to a room
  attachHub(emitter) {
    this.emitters.push(emitter);
    emitter.emit('setState', { state: STATE_STRINGS[this.state] })
    emitter.emit('hubAttached', this);
    // Get the hub up to date on the players in the room
    for (let [id, player] of this.players) {
      emitter.emit('playerJoined', player);
    }
    // Get the hub up to date on the round state
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

  // Function for checking if a hub is attached
  hasHub() {
    return this.attachedHub;
  }

  isOpen() {
    return this.state !== STATES.CLOSED;
  }

  // Partially implemented function to detach a hub
  deattachHub(emitter) {
    this.emitters = this.emitters.splice(this.emitters.indexOf(emitter), 1);
  }

  // Function to get the current question
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

  // Function that returns the room's attributes as a JSON
  toJSON() {
    return {
      id: this.id,
    };
  }

}

module.exports = Room;
