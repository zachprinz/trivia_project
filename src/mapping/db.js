const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/trivia_project';

// Rather than regular callbacks, mongoose uses promises (similar to callbacks)
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

module.exports = { mongoose };
