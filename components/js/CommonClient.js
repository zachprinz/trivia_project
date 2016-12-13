/* eslint-env jquery */
/* global document:true */

// Register all of the events that are needed for interacting with the text edit UI elements.
function initTextEdit() {
  // When the user clicks on the actual input element, don't close the edit
  $('.user-menu-label-edit').click(function (event) {
    event.stopPropagation();
  });
  // When the user clicks on a text input UI element, open it up for them to edit
  $('.user-menu-item.single').click(function (event) {
    // If this is a multi item menu item we don't want this behavior.
    const open = $('.user-menu-item.edit');
    let icon = $(this).find('.fa-check');
    // Add styling classes for the icon that appears on the left (small)
    if (open && icon) {
      open.removeClass('edit');
      icon.removeClass('fa-check');
      icon.addClass('fa-pencil fa-flip-horizontal');
    }
    // If we're clicking on the already open text edit we won't want to reopen it we want it to close
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
  // If the user hits enter we want to submit the change (perform a click event)
  $('.user-menu-label-edit').keyup(function (event) {
    if (event.keyCode === 13) {
      $(this).parent().parent().click();
    }
  });
}

// Register the events that are neccessary to work the spinner elements
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
  // When the user hits a spinner button we want to incremenet or decrement the value
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

// Initiate the fadeout effect when the user navigates away from the page via the nav
function initNavtab() {
  $('.navlink').click(function (event) {
    event.preventDefault();
    $('.fadeable').fadeOut(500);
    $(this).unbind(event);
    setTimeout(this.click.bind(this), 500);
  });
}

// Prevent mobile browsers from zooming in on text edit elements
function preventFocusZoom() {
  $('input,select').bind('focusout blur',function(e) {
    $('html, body').animate({scrollTop:0,scrollLeft:0}, 100);
  });
}

// When the user clicks on the mobbile menu icon we want to open up the navigation dropdown
function showDropdown() {
  $('.nav-stub').toggleClass('menuOpen');
  document.getElementById("my-sub-menu").classList.toggle("show");
}

// Function that applies the inner jQuery to each page independant of which client is being accessed
$(document).ready(() => {
  $('.fadeable').fadeIn(500);
  initNavtab();
  initTextEdit();
  initSpinner();
  preventFocusZoom();
});
