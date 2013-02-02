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
      setTimeout(function(){ search('fashion', [0,num]) }, 300);
    }

  });

  // shuffle in images
  jQuery.fn.shuffleElements = function () {
      var o = $(this);
      for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };

  // core logic
  function search(keyword, val){
    $('#spin').fadeIn();
    console.log('searching for products under $' + val[1])
    // shuffle() - run this after the images have been appended
    $('#spin').fadeOut();
  }

  function shuffle(){
    var play = 0;
    $("ul[data-liffect] li").shuffleElements().each(function (i) {
        $(this).attr("style", "-webkit-animation-delay:" + i * 100 + "ms;"
                + "-moz-animation-delay:" + i * 100 + "ms;"
                + "-o-animation-delay:" + i * 100 + "ms;"
                + "animation-delay:" + i * 100 + "ms;");
        play++;
        if (play == $("ul[data-liffect] li").size()) {
            $("ul[data-liffect]").addClass("play")
        }
    });
  }

});