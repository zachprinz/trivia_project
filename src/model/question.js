/**
 * Class used to model questions used in the trivia game.
 */
class Question {

  /**
   * Construct the questions data
   * @param  {String} question The text of the question
   * @param  {Array} answers An array of texts for the answers
   * @param  {string} correct The text of the correct answer
   * @param  {ObjectId} _id The Mongoose ObjectId of the question
   */
  constructor(question, answers, correct, _id) {
    this.answers = answers;
    this.correct = correct;
    this.id = _id;
    this.question = question;
  }

  /**
   * Checks the correctness of the passed answer
   * @param  {String} answer the answer to be checked
   * @return {bool}          whether or not the answer is correct
   */
  check(answer) {
    return answer === this.correct;
  }

  toJSON() {
    return {
      question: this.question,
      answers: this.answers,
    };
  }
}

module.exports = { Question };
