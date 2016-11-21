/* eslint-env jquery */
/* global document:true */

const socket = io();

const userItem = $([
  '<li class="player-label">',
  '</li>',
].join('\n'));

let playerCount = 0;

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('playerJoined', (data) => {
  const user = userItem.clone();
  user.attr('value', data.id);
  user.text('Player ' + data.id);
  console.log('playerJoined');
  $('#playerList').append(user);
  $('.playercount-label').text(++playerCount);
});

socket.on('playerLeft', (data) => {
  console.log('playerLeft');
  const playerSelector = 'h3[value="' + data.id + '"]';
  $('#playerList').find(playerSelector).remove();
  $('.playercount-label').text(--playerCount);
});

socket.on('hubAttached', (data) => {
  $('#playerList').empty();
  $('#room_id_label').text(data.id);
  $('#join_room_button').blur();
  $('#join_room_button').prop('disabled', true);
});

socket.on('roomJoinFailed', (data) => {
  console.log('failed to find roomss');
});

function updateEventTime(time) {
  $('#eventLabelTime').text(time / 1000);
  if (time > 1000) {
    setTimeout(updateEventTime.bind(this, time - 1000), 1000);
  }
}

socket.on('roundBegin', (data) => {
  $('.question-text').empty();
  $('.question-text').text(data.question);
  $('#eventLabelEvent').text('Round ending in: ');
  updateEventTime(data.time);
});

socket.on('roundEnd', (data) => {
  $('#eventLabelEvent').text('New round beginning in: ');
  updateEventTime(data.time);
});

function registerJoinRoom() {
  $('#join_room_button').click(() => {
    socket.emit('joinRoom', { roomID: $('[name=roomID]').val() });
  });
}

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
