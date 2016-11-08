const mongoose = require('mongoose');

const DB_URL = 'mongodb://heroku_h36stnw9:8fpdre4nvbsc5mk0odguqsfes3@ds151927.mlab.com:51927/heroku_h36stnw9';

// Rather than regular callbacks, mongoose uses promises (similar to callbacks)
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

module.exports = { mongoose };
