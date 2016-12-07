// Constant value to hold the questionMapper service
const QuestionMapper = require('../mapping/QuestionMapper.js');

// Export the module so that it's visible by the entire application
module.exports = {

  transitionRound(room) {
    QuestionMapper.findAny().then((question) => {
      room.beginRound(question);
    }).catch((err) => {
      console.log(err);
    });
  },

};
