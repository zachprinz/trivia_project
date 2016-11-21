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
  }

  addAnswer(answer) {
    this.answers.push(answer);
    this.emitter.emit('answerGraded', answer);
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
    this.emitter.emit('roomJoined', room);
  }
}

module.exports = Player;
