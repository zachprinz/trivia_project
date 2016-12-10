
// Class to model an answer
class Answer {

  // Constructor that sets the value of the object
  constructor(answer) {
    this.answer = answer;
  }

  // Function to grade the question
  grade(question) {
    this.correct = question.check(this.answer);
  }

  // Fucntion that returns a JSON with whether the answer is correct and the answer itself
  toJSON() {
    return {
      correct: this.correct,
      answer: this.answer,
    };
  }

}

module.exports = Answer;
