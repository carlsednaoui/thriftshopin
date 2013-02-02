$(function(){

  // spin.js
  var opts = {lines: 7, length: 3, width: 4, radius: 6, corners: 1, rotate: 0, color: '#fff', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto'};
  new Spinner(opts).spin(document.getElementById('spin'));

  // keep it in the center
  $('#spin').css({ left: (window.innerWidth/2) + "px" })

  $('input').on('keyup', function(){
    var val = $(this).val();
    var num = val.replace('$','');
    $('.toorich').hide()

    // make sure theres a \$
    if (!val.match(/\$/)){
      $(this).val('$' + val);
    }

    // no shenanigans
    if (val.match(/[A-Za-z]+/)){
      $(this).val('$');
      return false
    }

    // you're too rich
    if (parseInt(num) > 100){
      $('.toorich span').text('$' + (num - 100) + " ")
      num = 100; $(this).val('$100');
      $('.toorich').slideDown()
    }

    // only search if there's a number
    if (val.match(/\d+/)){
      setTimeout(function(){ search(num) }, 300);
    }

  });

  // core logic
  function search(val){
    $('#spin').fadeIn()
    console.log('searching for products under $' + val)
    setTimeout(function(){ $('#spin').fadeOut() }, 500)
  }

});