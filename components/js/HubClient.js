/* eslint-env jquery */
/* global document:true */

// Use a socket to open a connection to hte server
const socket = io();

// Hand-write a list item in HTML for user items
const userItem = $([
  '<li class="player-wrapper">',
    '<div class="player-label"></div>',
    '<div class="player-score">',
      '<span class="player-score-label">Score:</span>',
      '<span class="player-score-value">0</span></div>',
  '</li>',
].join('\n'));

// Initialize the player count to 0
let playerCount = 0;
let isOver = false;

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
  user.find('.player-label').text('Player ' + data.id);
  user.find('.player-score-value').text(data.score);

  // Use jQuery to append the user data to the view
  $('#playerList').append(user);
  playerCount += 1;
  $('.playercount-label').text(playerCount);
});

// Listen for playerLeft events from the server
socket.on('playerLeft', (data) => {
  if (isOver) {
    return;
  }
  // Build up the view from the data object
  const playerSelector = '.player-wrapper[value="' + data.id + '"]';
  // Use jQuery to remove the player from the view
  $('#playerList').find(playerSelector).remove();
  playerCount -= 1;
  console.log('playerLeft');
  $('.playercount-label').text(playerCount);
});

// Listen for hubAttached events from the server
socket.on('hubAttached', (data) => {
  // Use jQuery to modif the view based on the id within the HTML file
  $('#playerList').empty();
  $('#roomLabel').text(data.id);
});

socket.on('setState', (data) => {
  $('body').attr('data-state', data.state);
});

socket.on('setScore', (data) => {
  const label = $('.player-wrapper[value=' + data.id + ']');
  const scoreLabel = label.find('.player-score-value');
  scoreLabel.text(parseInt(data.score, 10));
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

socket.on('endGame', () => {
  isOver = true;
})

function joinRoom() {
  if ($('[name=roomID]').val() !== $('#roomLabel').text()) {
    socket.emit('joinRoom', { roomID: $('[name=roomID]').val() });
  }
}

// Execute the registrations above when the document fires a ready event
$(document).ready(() => {

  socket.emit('registerAsHub', {requestedRoomID: $('body').attr('data-room') });
});
