/* eslint-env jquery */
/* global document:true */

// Register a socket to used to connect to the server
const socket = io();

// Variable that is used to render the HTML for an answer
const answerItem = $([
  '<div class="answer active" name="answer">',
  ' <div class="answer-select"></div>',
  ' <span></span>',
  '</div>',
].join('\n'));

// Function that listens for 'connect' messages
socket.on('connect', () => {
  console.log('Connected');
});

// Function that listen for 'disconnect' messages
socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Functiont that listens for 'endGame' messages and replaces with the current window with the
// "end" page
socket.on('endGame', () => {
  window.location.replace('/end');
});

// Function that listens for roomJoined messages, with included data
socket.on('roomJoined', (data) => {
  // jQuery functions that execute on the html described in the function arguments
  $('#room_id_label').text(data.id);
  $('#join_room_button').blur();
  $('#join_room_button').prop('disabled', true);
  $('#eventLabelEvent').text('Waiting to leave room... ');
  //$('#eventLabelTime').text(data.id);
});

// Fucntion that listens for 'roomJoinFailed' messages, with included data
socket.on('roomJoinFailed', (data) => {
  console.log('failed to find roomss');
});

// Function that updates the time using a passed in argument
function updateEventTime(time) {
  // jQuery function that sets the text of the eventLabelTime element of the HTML to the time/100
  $('#eventLabelTime').text(time / 1000);
  if (time > 1000) {
    setTimeout(updateEventTime.bind(this, time - 1000), 1000);
  }
}

// Function that listens for 'roundBegin' messages, with included data
socket.on('roundBegin', (data) => {
  $('#answer_list').empty();
  $('.question-text').text(data.question);
  // Set a constant value for the answers found in the data object
  const answers = data.answers;
  // For each loop that goes through answer and pulls out the value
  answers.forEach((answer) => {
    const answerBody = answerItem.clone(true);
    answerBody.val(answer);
    answerBody.find('span').text(answer);
    $('#answer_list').append(answerBody);
  });
  // jQuery that executes on the given HTML elements, mostly to disable the buttons 
  $('#answer_list :first-child').addClass('selected');
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', true);
  $('#eventLabelEvent').text('Round ending in: ');
  updateEventTime(data.time);
  registerSelectAnswer();
});

// Function that listens for 'roundEnd' messages, with included data
socket.on('roundEnd', (data) => {
  // jQuery that edits the given HTML elements
  $('#eventLabelEvent').text('New round beginning in: ');
  $('.answer.active').each(function () {
    $(this).removeClass('active');
    $(this).unbind('click');
  });
  $('.answer.selected').removeClass('.selected');
  updateEventTime(data.time);
});

// Function that listens for 'answerGraded' messages, with included data
socket.on('answerGraded', (data) => {
  // Upon completion, restyle the page to reflect the result
  if (data.correct) {
    $('.answer.selected').addClass('correct');
  } else {
    $('.answer.selected').addClass('incorrect');
  }
  // jQuery that disables the answer button and enables the next question button
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', false);
  $('.answer').prop('disabled', true);
});

// Function that listens for 'regesterAsPlayer' message
socket.on('registeredAsPlayer', () => {
  // Emit a new event with a requestNewQuestion message
  socket.emit('requestNewQuestion');
});

/**
 * Register a listener for click events on the answer_submit_button
 */
function registerSubmitAnswer() {
  $('#answer_submit_button').click(() => {
    $('.answer.active').each(function () {
      $(this).removeClass('active');
      $(this).unbind('click');
    });
    socket.emit('submitAnswer', {
      answer: $('.answer.selected').val(),
    });
  });
}

/**
 * Register a listener for a selection even on one of the answers
 * On answer selection, enable the submit button
 */
function registerSelectAnswer() {
  $('.answer :first-child').each(function () {
    $(this).attr('maxWidth', $(this).parent().outerWidth(true) + 'px');
  });
  $('.answer').click(function () {
    $('.answer.deselected').removeClass('deselected');
    $('.answer.selected').addClass('deselected');
    $('.answer.selected.deselected').removeClass('selected');
    $(this).addClass('selected');
    $('#answer_submit_button').prop('disabled', false);
  });
}

/**
 * Register a listener for the next question button
 * On next question click, request a new question
 */
function registerNextQuestion() {
  $('#next_question_button').click(() => {
    socket.emit('requestNewQuestion');
  });
}

// Function that registers a listener for the join room button
function registerJoinRoom() {
  // jQuery that determines what happens when the join room button is clicked
  $('#join_room_button').click(() => {
    socket.emit('joinRoom', { roomID: $('[name=roomID]').val() });
  });
}

// Function that registers a listener for the room id input box
function registerEditRoom() {
  // jQuery that executes when the text field for the room id is utilized
  $('#room_id_field').on('input', () => {
    $('#join_room_button').prop('disabled', false);
  });
}

// Execute the registrations above when the document fires a ready event
$(document).ready(() => {
  registerSubmitAnswer();
  registerSelectAnswer();
  registerNextQuestion();
  registerJoinRoom();
  registerEditRoom();
  socket.emit('registerAsPlayer');
});
