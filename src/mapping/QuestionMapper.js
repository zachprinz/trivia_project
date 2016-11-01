const ObjectId = require('mongoose').Types.ObjectId;

const { QuestionDB } = require('../model/schemas/question.js');
const { Question } = require('../model/question.js');

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  findByID(id) {
    const query = {
      _id: typeof id === 'string'
        ? id
        : new ObjectId(id),
    };
    return new Promise((resolve, reject) => {
      QuestionDB.find(query).then((questions) => {
        // TODO handle empty question result array
        const { question, answers, correct, _id } = questions[0];
        const q = new Question(question, answers, correct, _id);
        resolve(q);
      }).catch((err) => {
        console.log(err);
        const q = new Question();
        resolve(q);
      });
    });
  },

  findAny() {
    return new Promise((resolve, reject) => {
      QuestionDB.find().then((questions) => {
        const index = getRandomIndex(questions.length);
        const { question, answers, correct, _id } = questions[index];
        const q = new Question(question, answers, correct, _id);
        resolve(q);
      }).catch((err) => {
        console.log(err);
        const q = new Question();
        resolve(q);
      });
    });
  },
};
