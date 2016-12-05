// Assign an event emitter to the constant variable
const EventEmitter = require('events');
// Assign the questionService to the constatn variable
const QuestionService = require('../service/QuestionService.js');
/**
 * Class used to model the game room
 */
// Create a map to hold the rooms
const rooms = new Map();

// Set constant values for round time, break between rounds, and default number of rounds
const ROUND_TIME = 6000;
const ROUND_BREAK_TIME = 2000;
const DEFAULT_ROUND_MAX = 5;

// Funcion that returns the room id
const getNewRoomID = (() => {
  let curID = 0;
  return () => {
    curID += 1;
    return curID;
  };
})();

// Class used to model a room
class Room {
  
  // Constructor that set the values of the object
  constructor() {
    this.id = getNewRoomID();
    this.players = new Map();
    this.attachedHub = false;
    rooms.set(this.id, this);
    this.emitter = new EventEmitter();
    QuestionService.transitionRound(this);
    this.roundCount = 0;
    this.roundMax = DEFAULT_ROUND_MAX;
  }

  // Static function to find a room by its ID
  static findByID(id) {
    return rooms.get(id);
  }

  // Static function that checks for an existing room based on its ID
  static roomExists(id) {
    return Room.findByID(id) !== undefined;
  }

  // Static function to set the number of rounds
  static setRoundMax(roundMax){
    // Conditional that checks whether the desired round max is lower than the current round
    if(roundMax < this.roundCount){
      this.roundMax = roundMax;
    }
    console.log("In the room model: " + roundMax);
  }

  // Function that is called when the round ends
  endRound() {
    // Increment the round count
    this.roundCount++;
    // Conditional that checks whether the max number of rounds has passed
    if (this.roundCount === this.roundMax) {
      this.endGame();
    } else {
      setTimeout(QuestionService.transitionRound.bind(undefined, this), ROUND_BREAK_TIME);
      // Emit a message to each player that the round is over
      for (let [id, player] of this.players) {
        player.emitter.emit('roundEnd', ROUND_BREAK_TIME);
      }
      // Emit a message to non-players that the round is over
      this.emitter.emit('roundEnd', ROUND_BREAK_TIME);
    }
  }

  // Function that is called when the game is over
  endGame() {
    // For-Each loop that emits a message to each player that the game is over and removes the player from the room
    for (let [id, player] of this.players) {
      player.emitter.emit('endGame');
      this.removePlayer(player);
    }
  }

  // Function that is called to begin a round
  beginRound(question) {
    this.curQuestion = question;
    // For-each loops that emits a message to all players that the round has started
    for (let [id, player] of this.players) {
      player.emitter.emit('roundBegin', { time: ROUND_TIME });
    }
    // Emits a message to non-players that the round has started
    this.emitter.emit('roundBegin', { time: ROUND_TIME });
    setTimeout(this.endRound.bind(this), ROUND_TIME);
  }

  // Function that is called to add a player
  addPlayer(player) {
    this.players.set(player.getID(), player);
    this.emitter.emit('playerJoined', player);
  }

  // Function that is called to remove a player
  removePlayer(player) {
    this.players.delete(player.getID());
    this.emitter.emit('playerLeft', player);
  }

  // Function that is called to attach a hub to a room
  attachHub(emitter) {
    this.attachedHub = true;
    this.emitter = emitter;
    // Emit a message to the non-players that the hub has been attached
    this.emitter.emit('hubAttached', this);
    // For-each loop that emits a message that the player has joined
    for (let [id, player] of this.players) {
      this.emitter.emit('playerJoined', player);
    }
  }

  // Function for checking if a hub is attached
  hasHub() {
    return this.attachedHub;
  }

  // Partially implemented function to detach a hub
  deattachHub() {
    this.emitter = new EventEmitter();
  }

  // Function to get the current question
  getCurrentQuestion() {
    return this.curQuestion;
  }

  // Function to get the room's ID
  getID() {
    return this.id;
  }

  // Function that returns the room's ID as a JSON
  toJSON() {
    return {
      id: this.id,
    };
  }

}

module.exports = Room;
