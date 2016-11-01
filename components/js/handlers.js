/* eslint-env jquery */
/* global document:true */

function registerSubmitAnswer() {
  $('#answer_submit_button').click(() => {
    const $answer = $('input[name="answer"]:checked');
    const answerData = {
      questionId: $answer.attr('data-question'),
      answer: $answer.val(),
    };
    $.ajax({
      url: '/answer',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(answerData),
      success: (data) => {
        if (data.correct) {
          $answer.parent().find('span').addClass('label label-success');
        } else {
          $answer.parent().find('span').addClass('label label-danger');
        }
        $('#answer_submit_button').prop('disabled', true);
        $('#next_question_button').prop('disabled', false);
        $('.answer').prop('disabled', true);
      },
    });
  });
}

function registerSelectAnswer() {
  $('.answer').click(() => {
    $('#answer_submit_button').prop('disabled', false);
  });
}

function requestNewQuestion() {
  $('.questionBody').load('/next', () => {
    $('#answer_submit_button').prop('disabled', true);
    $('#next_question_button').prop('disabled', true);
    registerSelectAnswer();
  });
}

function registerNextQuestion() {
  $('#next_question_button').click(() => {
    requestNewQuestion();
  });
}

$(document).ready(() => {
  registerSubmitAnswer();
  registerSelectAnswer();
  registerNextQuestion();
  requestNewQuestion();
});
