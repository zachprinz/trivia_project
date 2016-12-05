/* eslint-env jquery */
/* global document:true */

// Register a socket to connect to the server
const socket = io();

// Variable for rendering the user item HTML
const userItem = $([
  '<li class="player-label">',
  '</li>',
].join('\n'));

// Local variable for the number of players
let playerCount = 0;

// Function that listens for connect messages
socket.on('connect', () => {
  console.log('Connected');
});

// Function that listens for disconnect messages
socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Function that listens for playJoined messages
socket.on('playerJoined', (data) => {
  // Clone the variable with the HTML 
  const user = userItem.clone();
  // Grab the values out of the data object
  user.attr('value', data.id);
  user.text('Player ' + data.id);
  console.log('playerJoined');
  // jQuery to add the user values to the HTML elements
  $('#playerList').append(user);
  $('.playercount-label').text(++playerCount);
});

// Function that listens for playerLeft message
socket.on('playerLeft', (data) => {
  console.log('playerLeft');
  // Variable the inserts the player id into an HTML element
  const playerSelector = 'h3[value="' + data.id + '"]';
  // jQuery that adds the HTML into the given HTML
  $('#playerList').find(playerSelector).remove();
  $('.playercount-label').text(--playerCount);
});

// Function that listens for hubAttached message
socket.on('hubAttached', (data) => {
  // jQuery that manipulates the given HTML elements
  $('#playerList').empty();
  $('#room_id_label').text(data.id);
  $('#join_room_button').blur();
  $('#join_room_button').prop('disabled', true);
});

// Function that listens for roomJoinFailed messages
socket.on('roomJoinFailed', (data) => {
  console.log('failed to find roomss');
});

// Function that updates the time of an event
function updateEventTime(time) {
  // jQuery that updates the given HTML element with the time/100
  $('#eventLabelTime').text(time / 1000);
  if (time > 1000) {
    setTimeout(updateEventTime.bind(this, time - 1000), 1000);
  }
}

// Functions that listens for roundBegin message
socket.on('roundBegin', (data) => {
  $('.question-text').empty();
  // jQuery that adds the question text to the given HTML element
  $('.question-text').text(data.question);
  $('#eventLabelEvent').text('Round ending in: ');
  updateEventTime(data.time);
});

// Function that listens for roundEnd message
socket.on('roundEnd', (data) => {
  $('#eventLabelEvent').text('New round beginning in: ');
  updateEventTime(data.time);
});

// Function that registers a listener for a room join button click
function registerJoinRoom() {
  $('#join_room_button').click(() => {
    // Emit a new event with a join room message and a JSON with the roomID
    socket.emit('joinRoom', { roomID: $('[name=roomID]').val() });
  });
}

// Function that registers a listener for input in the text field for changing rooms
function registerEditRoom() {
  $('#room_id_field').on('input', () => {
    $('#join_room_button').prop('disabled', false);
  });
}

// Execute the registrations above when the document fires a ready event
$(document).ready(() => {
  registerJoinRoom();
  registerEditRoom();
  socket.emit('registerAsHub');
});
