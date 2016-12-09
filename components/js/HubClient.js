/* eslint-env jquery */
/* global document:true */

// Use a socket to open a connection to hte server
const socket = io();

// Hand-write a list item in HTML for user items
const userItem = $([
  '<li class="player-label">',
  '</li>',
].join('\n'));

// Initialize the player count to 0
let playerCount = 0;

// Listen for connect events from the server
socket.on('connect', () => {
  console.log('Connected');
});

// Listen for disconnect events from the server
socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Listen for playerJoined events from the server
socket.on('playerJoined', (data) => {
  // Build the view up from the data passed into the anonymous function
  const user = userItem.clone();
  user.attr('value', data.id);
  user.text('Player ' + data.id);
  console.log('playerJoined');
  // Use jQuery to append the user data to the view
  $('#playerList').append(user);
  $('.playercount-label').text(++playerCount);
});

// Listen for playerLeft events from the server
socket.on('playerLeft', (data) => {
  console.log('playerLeft');
  // Build up the view from the data object
  const playerSelector = 'h3[value="' + data.id + '"]';
  // Use jQuery to remove the player from the view
  $('#playerList').find(playerSelector).remove();
  $('.playercount-label').text(--playerCount);
});

// Listen for hubAttached events from the server
socket.on('hubAttached', (data) => {
  // Use jQuery to modif the view based on the id within the HTML file
  $('#playerList').empty();
  $('#roomLabel').text(data.id);
});

// Listen for roomFailed events from the server
socket.on('roomJoinFailed', (data) => {
  console.log('failed to find roomss');
});

// Function that updates the current time
function updateEventTime(time) {
  // Use jQuery to update the view
  $('#eventLabelTime').text(time / 1000);
  if (time > 1000) {
    setTimeout(updateEventTime.bind(this, time - 1000), 1000);
  }
}

// Listen for roundBegin event from the server
socket.on('roundBegin', (data) => {
  if ($('body').hasClass('preGameStarted')) {
    $('body').removeClass('preGameStarted');
    $('body').addClass('gameStarted');
  }
  console.log('round began');
  // Use jQuery to update the view
  $('.question-text').empty();
  $('.question-text').text(data.question);
  $('#eventLabelEvent').text('Round ending in: ');
  updateEventTime(data.time);
});

// Listen for roundEnd events from the server
socket.on('roundEnd', (data) => {
  // use jQuery to update the view
  $('#eventLabelEvent').text('New round beginning in: ');
  updateEventTime(data.time);
});

// Execute the registrations above when the document fires a ready event
$(document).ready(() => {
  socket.emit('registerAsHub');
});
