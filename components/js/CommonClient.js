/* eslint-env jquery */
/* global document:true */

function initTextEdit() {
  $('.user-menu-label-edit').click(function (event) {
    event.stopPropagation();
  });
  $('.user-menu-item.single').click(function (event) {
    // If this is a multi item menu item we don't want this behavior.
    const open = $('.user-menu-item.edit');
    let icon = $(this).find('.fa-check');
    if (open && icon) {
      open.removeClass('edit');
      icon.removeClass('fa-check');
      icon.addClass('fa-pencil fa-flip-horizontal');
    }
    if (!open || !$(this).is(open)) {
      $(this).addClass('edit');
      $('.edit .user-menu-label-edit').focus();
      $(this).find('.span').val()
      $('.edit input').val($(this).find('.user-menu-item-label').text());
      icon = $(this).find('.fa-pencil');
      icon.removeClass('fa-pencil fa-flip-horizontal');
      icon.addClass('fa-check');
    } else {
      // Commit the change
      if ($(this).find('.usernameLabel').size()) {
        setUsername();
        /* Empty */
      } else if ($(this).find('.roomLabel').size()) {
        joinRoom();
      }
    }
  });
  $('.user-menu-label-edit').keyup(function (event) {
    if (event.keyCode === 13) {
      $(this).parent().parent().click();
    }
  });
}

function initSpinner() {
  $('.menu-spinner-wrapper:not(.disabled) .menu-spinner-body-wrapper').click(function (event) {
    const open = $('.menu-spinner-wrapper.edit');
    if (open) {
      open.removeClass('edit');
    }
    if (!open || !$(this).parent().is(open)) {
      $(this).parent().addClass('edit');
    }
  });

  $('.menu-spinner-button').click(function (event) {
    let valueElement = $(this).parent().find('.menu-spinner-value');
    let value = parseInt(valueElement.text(), 10);
    value += $(this).hasClass('right') ? 1 : -1;
    if (value < 0) {
      value = 0;
    }
    valueElement.text(value);
  });
}

function initNavtab() {
  $('.navlink').click(function (event) {
    event.preventDefault();
    $('.fadeable').fadeOut(500);
    $(this).unbind(event);
    setTimeout(this.click.bind(this), 500);
  });
}

function preventFocusZoom() {
  $('input,select').bind('focusout blur',function(e) {
    $('html, body').animate({scrollTop:0,scrollLeft:0}, 100);
  });
}

function showDropdown() {
  $('.nav-stub').toggleClass('menuOpen');
  document.getElementById("my-sub-menu").classList.toggle("show");
}

$(document).ready(() => {
  $('.fadeable').fadeIn(500);
  initNavtab();
  initTextEdit();
  initSpinner();
  preventFocusZoom();
});
