const mongoose = require('mongoose');
const question_schema = require('./schemas/question');

var Question = mongoose.model(
  'question',
  new mongoose.Schema(question_schema)
);

module.exports = {Question};
