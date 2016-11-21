/* eslint-env jquery */
/* global document:true */

$(document).ready(() => {
  $('.fadeable').fadeIn(500);
  $('.navlink').click(function (event) {
    event.preventDefault();
    $('.fadeable').fadeOut(500);
    $(this).unbind(event);
    setTimeout(this.click.bind(this), 500);
  });
});
