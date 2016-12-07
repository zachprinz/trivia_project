/**
 * Created by Edward on 12/3/2016.
 */

// Create a socket to connect to the server
const socket = io();

// Function that executes when receiving a 'connect' message
socket.on('connect', () => {
    console.log('Connected');
});

// Function that executes when receiving a 'disconnect' message
socket.on('disconnect', () => {
    console.log('Disconnected');
});

// Function that executes when receiving a 'RoundSet' message
socket.on('RoundMaxSet', (data) =>{
    console.log("Round max set as: " + data);
});

// Function that registers a listener for the submit button for the round max button
function registerSubmitRoundMax() {
    console.log("Register submit round max function called.")
    // jQuery that listens for a click event on the button
    $('#setRounds').click(() => {
        console.log("Clicked" );
        // Emit an event with the submitRounds messages and the inout fom the text field
        socket.emit('submitRounds', {
            rounds: $('#admininput').val()
        });
    });
}

// Function that executes after the document is ready/fully loaded
$(document).ready(() => {
    registerSubmitRoundMax();
    socket.emit('registerAsAdmin');
});
