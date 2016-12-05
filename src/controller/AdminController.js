/**
 * Created by Edward on 12/4/2016.
 */

const RoomService = require('../service/RoomService.js');
const EventEmitter = require('events');

module.exports = {
    listen(socket) {
        socket.on('submitRounds', (data) => {
            console.log(data.rounds)
            RoomService.adminChangeRoundMax(data.rounds)
        });

    },
};

