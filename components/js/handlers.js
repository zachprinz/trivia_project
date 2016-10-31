function registerSubmitAnswer() {
  $("#answer_submit_button").click(function() {
    var data = {
      answer_id: $("input[name='answer']:checked").val()
    };
    $.ajax({
      url: '/answer',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        console.log('success');
      }
    });
  });
}

$(document).ready(function(){
  registerSubmitAnswer();
});
