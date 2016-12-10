const EventEmitter = require('events');

/**
 * Class used to model a Player
 */
const getNewUserID = (() => {
  let curID = 0;
  return () => {
    curID += 1;
    return curID;
  };
})();

class Player {

  constructor() {
    this.id = getNewUserID();
    this.answers = [];
    this.emitter = new EventEmitter();
    this.score = 0;
  }

  addAnswer(answer) {
    this.answers.push(answer);
    this.emitter.emit('answerGraded', answer);
    if (answer.correct) {
      this.score += 1;
      this.getRoom().setScore(this);
    }
  }

  getID() {
    return this.id;
  }

  getRoom() {
    return this.room;
  }

  setRoom(room) {
    if (this.room) {
      this.room.removePlayer(this);
    }
    this.room = room;
    this.score = 0;
    this.answers = [];
    this.emitter.emit('roomJoined', room);
  }

  toJSON() {
    return {
      id: this.id,
      score: this.score,
    };
  }
}

module.exports = Player;
