const { mongoose } = require('../../mapping/db.js');

// Definition of the fields required in the QuestionDB entries
const schema = {
  question: {
    minlength: 1,
    required: true,
    trim: true,
    type: String,
  },
  answers: {
    required: true,
    type: [String],
    validate: {
      validator(v) {
        return v.length > 1;
      },
      message: 'No answers provided',
    },
  },
  correct: {
    minlength: 1,
    required: true,
    type: String,
  },
};

// Construct a Model object for querying/writing
const QuestionDB = mongoose.model(
  'question',
  new mongoose.Schema(schema)
);

module.exports = { QuestionDB };
