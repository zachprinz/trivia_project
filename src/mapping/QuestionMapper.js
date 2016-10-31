const {mongoose} = require('./db.js');
const ObjectId = require('mongoose').Types.ObjectId;


var {QuestionDB} = require('../model/schemas/question.js');
var {Question} = require('../model/question.js');

function getRandomIndex(max) {
  return Math.floor(Math.random() * (max - 1));
}

module.exports = {
  findByID: function(id, callback) {
    if (typeof id === "string") {
      id = new ObjectId(id);
    }
    return new Promise(function(resolve, reject) {
      QuestionDB.find({_id: id}).then(
        questions => {
          var {question, answers, correct, _id} = questions[0];
          var q = new Question(question, answers, correct, _id);
          resolve(q);
        },
        err => {
          console.log(err);
          var q = new Question();
          resolve(q);
        }
      );
    });
  },

  findAny: function(callback) {
    return new Promise(function(resolve, reject) {
      QuestionDB.find().then(
        questions => {
          var index = getRandomIndex(questions.length);
          console.log('index: ' + index);
          var {question, answers, correct, _id} = questions[index];
          var q = new Question(question, answers, correct, _id);
          resolve(q);
        },
        err => {
          console.log(err);
          var q = new Question();
          resolve(q);
        }
      );
    });
  }
}
