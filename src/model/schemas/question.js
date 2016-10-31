const mongoose = require('mongoose');

var schema = {
  question: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  answers: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.length > 1;
        },
        message: 'Not enough answers provided'
      },
      required: true,
  },
  correct: {
    type: String,
    required: true,
    minlength: 1
  }
};

var QuestionDB = mongoose.model(
  'question',
  new mongoose.Schema(schema)
);

module.exports = {QuestionDB};
