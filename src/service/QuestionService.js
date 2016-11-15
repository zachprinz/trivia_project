const QuestionMapper = require('../mapping/QuestionMapper.js');

module.exports = {

  transitionRound(room) {
    QuestionMapper.findAny().then((question) => {
      room.beginRound(question);
    }).catch((err) => {
      console.log(err);
    });
  },

};
