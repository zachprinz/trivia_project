function registerSubmitAnswer() {
  $("#answer_submit_button").click(function() {
    var answer = $("input[name='answer']:checked");
    var answerData = {
      question_id: answer.attr('data-question'),
      answer: answer.val()
    };
    console.log(answerData);
    $.ajax({
      url: "/answer",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(answerData),
      success: function(data) {
        if (data.correct) {
          answer.parent().find("span").addClass("label label-success");
        } else {
          answer.parent().find("span").addClass("label label-danger");
        }
        $("#answer_submit_button").prop('disabled', true);
        $("#next_question_button").prop('disabled', false);
        $(".answer").prop('disabled', true);
      }
    });
  });
}

function requestNewQuestion() {
  $(".questionBody").load("/next", function() {
    $("#answer_submit_button").prop('disabled', true);
    $("#next_question_button").prop('disabled', true);
    registerSelectAnswer();
  });
}

function registerNextQuestion() {
  $("#next_question_button").click(function() {
    requestNewQuestion();
  });
}

function registerSelectAnswer() {
  $(".answer").click(function() {
    $("#answer_submit_button").prop('disabled', false);
  });
}

$(document).ready(function(){
  registerSubmitAnswer();
  registerSelectAnswer();
  registerNextQuestion();
  requestNewQuestion();
});
