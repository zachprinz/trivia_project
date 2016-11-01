class Question {

  constructor(question, answers, correct, _id) {
    this.question = question;
    this.answers = answers;
    this.correct = correct;
    this.id = _id;
  }

  check(answer) {
    return answer === this.correct;
  }
}

module.exports = { Question };
