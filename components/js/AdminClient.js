/**
 * Created by Edward on 12/3/2016.
 */

const socket = io();

socket.on('connect', () => {
    console.log('Connected');
});

socket.on('disconnect', () => {
    console.log('Disconnected');
});

socket.on('RoundMaxSet', (data) =>{
    console.log("Round max set as: " + data);
});

function registerSubmitRoundMax() {
    console.log("Register submit round max function called.")
    $('#setRounds').click(() => {
        console.log("Clicked" );
        socket.emit('submitRounds', {
            rounds: $('#admininput').val()
        });
    });
}

$(document).ready(() => {
    registerSubmitRoundMax();
    socket.emit('registerAsAdmin');
});