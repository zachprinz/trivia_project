/* eslint-env jquery */
/* global document:true */

const socket = io();

const answerItem = $([
  '<div class="answer active" name="answer">',
  ' <div class="answer-select"></div>',
  ' <span></span>',
  '</div>',
].join('\n'));

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('endGame', () => {
  window.location.replace('/end');
});

socket.on('roomJoined', (data) => {
  $('#room_id_label').text(data.id);
  $('#join_room_button').blur();
  $('#join_room_button').prop('disabled', true);
  $('#eventLabelEvent').text('Waiting to leave room... ');
  //$('#eventLabelTime').text(data.id);
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
  $('#answer_list').empty();
  $('.question-text').text(data.question);
  const answers = data.answers;
  answers.forEach((answer) => {
    const answerBody = answerItem.clone(true);
    answerBody.val(answer);
    answerBody.find('span').text(answer);
    $('#answer_list').append(answerBody);
  });
  $('#answer_list :first-child').addClass('selected');
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', true);
  $('#eventLabelEvent').text('Round ending in: ');
  updateEventTime(data.time);
  registerSelectAnswer();
});

socket.on('roundEnd', (data) => {
  $('#eventLabelEvent').text('New round beginning in: ');
  $('.answer.active').each(function () {
    $(this).removeClass('active');
    $(this).unbind('click');
  });
  $('.answer.selected').removeClass('.selected');
  updateEventTime(data.time);
});

socket.on('answerGraded', (data) => {
  // Upon completion, restyle the page to reflect the result
  if (data.correct) {
    $('.answer.selected').addClass('correct');
  } else {
    $('.answer.selected').addClass('incorrect');
  }
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', false);
  $('.answer').prop('disabled', true);
});

socket.on('registeredAsPlayer', () => {
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
  registerSubmitAnswer();
  registerSelectAnswer();
  registerNextQuestion();
  registerJoinRoom();
  registerEditRoom();
  socket.emit('registerAsPlayer');
});
