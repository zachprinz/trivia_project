/* eslint-env jquery */
/* global document:true */

const socket = io();

const answerContainer = $('<div></div>');
const answerItem = $('<input></input>');
const answerLabel = $('<span></span>');
answerItem.addClass('answer');
answerItem.prop('name', 'answer');
answerItem.prop('type', 'radio');
answerLabel.addClass('answerLabel');
answerContainer.append(answerItem);
answerContainer.append(answerLabel);

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('enteredRoom', (data) => {
  $('#room_id_label').text(data.roomID);
  $('#join_room_button').blur();
  $('#join_room_button').prop('disabled', true);
});

socket.on('roundBegin', (data) => {
  console.log('round began');
  $('#answer_list').empty();
  $('#question_body').empty();
  $('#question_body').text(data.question);
  const answers = data.answers;
  answers.forEach((answer) => {
    const answerBody = answerContainer.clone();
    answerBody.find('.answer').val(answer);
    answerBody.find('.answerLabel').text(answer);
    $('#answer_list').append(answerBody);
  });
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', true);
  registerSelectAnswer();
});

socket.on('roundEnd', (data) => {
  console.log('Round has ended, new round starting in 2 seconds.');
});

socket.on('answerGraded', (data) => {
  console.log(data);
  // Upon completion, restyle the page to reflect the result
  const $answer = $('input[name="answer"]:checked');
  console.log($answer);
  if (data.correct) {
    $answer.parent().find('span').addClass('label label-success');
  } else {
    $answer.parent().find('span').addClass('label label-danger');
  }
  $('#answer_submit_button').prop('disabled', true);
  $('#next_question_button').prop('disabled', false);
  $('.answer').prop('disabled', true);
});

/**
 * Register a listener for click events on the answer_submit_button
 */
function registerSubmitAnswer() {
  $('#answer_submit_button').click(() => {
    const $answer = $('input[name="answer"]:checked');
    socket.emit('submitAnswer', {
      answer: $answer.val(),
    });
  });
}

/**
 * Register a listener for a selection even on one of the answers
 * On answer selection, enable the submit button
 */
function registerSelectAnswer() {
  $('.answer').click(() => {
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
  socket.emit('requestNewQuestion');
});
