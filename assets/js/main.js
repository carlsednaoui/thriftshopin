$(function(){

  // spin.js
  var opts = {lines: 7, length: 3, width: 4, radius: 6, corners: 1, rotate: 0, color: '#fff', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto'};
  new Spinner(opts).spin(document.getElementById('spin'));

  // keep it in the center
  $('#spin').css({ left: (window.innerWidth/2) + "px" });

  // initialize masonry

  var timer = null;
  $('input').on('keyup', function(){
    var val = $(this).val();
    var num = val.replace('$','');

    // setup
    $('.toorich').hide();
    clearTimeout(timer);

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
      timer = setTimeout(function(){ search('fashion', [0,num]) }, 300);
    }

  });

  // tag aggregation
  function popular_tags(){
    var all = []
    $('#main li').each(function(){
      var tags = $(this).attr('class');
      all.push(tags.split(' '));
    });

    var counts = count(_.flatten(all));
    var groups = _.groupBy(counts, function(a){ return a[1] });
    var by_count = _.flatten(_.toArray(groups)).reverse();
    var res = [];
    for (var i = 1; i < by_count.length; i += 2) { res.push(by_count[i]); }
    return res

    function count(arr) {
        var a = [], prev;
        
        arr.sort();
        for ( var i = 0; i < arr.length; i++ ) {
            if ( arr[i] !== prev ) {
                a.push([arr[i], 1]);
            } else {
                a[a.length-1][1]++;
            }
            prev = arr[i];
        }
        
        return a;
    }
  }


  // core logic
  function search(keyword, val, cb){
    $('#spin').fadeIn();
    console.log('searching for products under $' + val[1])
    keyword = 'fashion';
    var mainView, etsys, skimlinks;
    etsys = new TS.Collections.Etsys({ search: keyword, priceRange: val });
    etsys.fetch({update: true});
    // skimlinks = new TS.Collections.Skimlinks({ keywords: keyword, priceRange: val });
    // skimlinks.fetch({update: true});
    mainView = new TS.Views.Main({ el: '#main', collections: [ etsys ] });
    mainView.on('done', function() {
      $('#spin').fadeOut();
      console.log(popular_tags())
    });
  }

  // shuffle in images
  jQuery.fn.shuffleElements = function () {
      var o = $(this);
      for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };

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

  // music popup

  $('#music').css({ top: (window.innerHeight - 383)/2, left: (window.innerWidth - 300)/2 });

  $('.settings').on('click', function(){
    $('.filters').slideToggle();
    $('.music').on('click', function(){
      $('#music').fadeToggle();
    });
    return false
  });

});