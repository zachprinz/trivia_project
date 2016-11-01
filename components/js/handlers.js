/* eslint-env jquery */
/* global document:true */

/**
 * Register a listener for click events on the answer_submit_button
 */
function registerSubmitAnswer() {
  $('#answer_submit_button').click(() => {
    // Find the HTML element the user selected
    const $answer = $('input[name="answer"]:checked');

    // Package the questionId and answer text pulled off of the selected el
    const answerData = {
      questionId: $answer.attr('data-question'),
      answer: $answer.val(),
    };

    // Execute an ajax request to grade the answer packaged above
    $.ajax({
      url: '/answer',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(answerData),
      success: (data) => {
        // Upon completion, restyle the page to reflect the result
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
 * Make an AJAX request to load a new question
 * On responce, re-register the registerSelectAnswer on the new html buttons
 */
function requestNewQuestion() {
  $('.questionBody').load('/next', () => {
    $('#answer_submit_button').prop('disabled', true);
    $('#next_question_button').prop('disabled', true);
    registerSelectAnswer();
  });
}

/**
 * Register a listener for the next question button
 * On next question click, request a new question
 */
function registerNextQuestion() {
  $('#next_question_button').click(requestNewQuestion);
}

// Execute the registrations above when the document fires a ready event
$(document).ready(() => {
  registerSubmitAnswer();
  registerSelectAnswer();
  registerNextQuestion();
  requestNewQuestion();
});
