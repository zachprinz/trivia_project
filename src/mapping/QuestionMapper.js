const ObjectId = require('mongoose').Types.ObjectId;

const { QuestionDB } = require('../model/schemas/question.js');
const { Question } = require('../model/question.js');

module.exports = {
  /**
   * Query the DB for a question with a specific ID
   * @param  {ObjectId | string} id The ID to search for
   * @return {Promise(Question)} A Promise to be passed any found Question
   */
  findByID(id) {
    // If the id param passed is a string we need to convert it to an ObjectId
    const idObj = typeof id === 'string'
      ? id
      : new ObjectId(id);
    const query = { _id: idObj };
    return new Promise((resolve, reject) => {
      QuestionDB.find(query).then((questions) => {
        // TODO handle empty question result array
        // Use ES6 destructuring to pull off field from the JSON result
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

  /**
   * Query the DB for a random question
   * @return {Promise(Question)} A Promise to be passed a random Question
   */
  findAny() {
    return new Promise((resolve, reject) => {
      QuestionDB.find().then((questions) => {
        // findAny returns a random question, so compute a random index
        const index = Math.floor(Math.random() * questions.length);

        // Use ES6 destructuring to pull off field from the JSON result
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
