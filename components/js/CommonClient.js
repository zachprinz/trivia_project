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
  $('.single .user-menu-icon-wrapper').click(function (event) {
    const open = $('.user-menu-item.edit');
    let icon = $(this).find('.fa-check');
    if (open && icon) {
      open.removeClass('edit');
      icon.removeClass('fa-check');
      icon.addClass('fa-pencil fa-flip-horizontal');
    }
    if (!open || !$(this).parent().is(open)) {
      $(this).parent().addClass('edit');
      $('.edit .user-menu-label-edit').focus();
      $(this).parent().find('span').val()
      $('.edit input').val($(this).parent().find('#roomLabel').text());
      icon = $(this).find('.fa-pencil');
      icon.removeClass('fa-pencil fa-flip-horizontal');
      icon.addClass('fa-check');
    } else {
      // Commit the change
      if ($(this).hasClass('usernameLabel')) {
        /* Empty */
      } else if ($(this).hasClass('roomLabel')) {
        joinRoom();
      }
    }
  });

  $('.menu-spinner-body-wrapper').click(function (event) {
    const open = $('.menu-spinner-wrapper.edit');
    if (open) {
      open.removeClass('edit');
    }
    if (!open || !$(this).parent().is(open)) {
      $(this).parent().addClass('edit');
    }
  });

  $('input,select').bind('focusout blur',function(e) {
    $('html, body').animate({scrollTop:0,scrollLeft:0}, 100);
  });
});

function showDropdown(){
  $('.nav-stub').toggleClass('menuOpen');
  document.getElementById("my-sub-menu").classList.toggle("show");
}
