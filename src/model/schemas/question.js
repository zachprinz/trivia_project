const { mongoose } = require('../../mapping/db.js');

const schema = {
  question: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  answers: {
    type: [String],
    validate: {
      validator(v) {
        return v.length > 1;
      },
      message: 'No answers provided',
    },
    required: true,
  },
  correct: {
    type: String,
    required: true,
    minlength: 1,
  },
};

const QuestionDB = mongoose.model(
  'question',
  new mongoose.Schema(schema)
);

module.exports = { QuestionDB };
