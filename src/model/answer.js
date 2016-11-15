
class Answer {

  constructor(answer) {
    this.answer = answer;
  }

  grade(question) {
    this.correct = question.check(this.answer);
  }

  toJSON() {
    return {
      correct: this.correct,
      answer: this.answer,
    };
  }

}

module.exports = Answer;
