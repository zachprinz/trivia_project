/**
 * Created by Edward on 12/4/2016.
 */

// Assign variables to hold the emitter and RoomService
const RoomService = require('../service/RoomService.js');
const EventEmitter = require('events');

// Export the module so that is it visible to the entire application
module.exports = {
    listen(socket) {
        // Listen for submit rounds event 
        socket.on('submitRounds', (data) => {
            console.log(data.rounds)
            RoomService.adminChangeRoundMax(data.rounds)
        });

    },
};

