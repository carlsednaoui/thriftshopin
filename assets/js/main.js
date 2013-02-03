define(function(require) {

  var Spinner = require('spin'),
    TS = require('ts'),
    Backbone = require('backbone');

$(function(){

  // nordstrom detect
  if (window.location.href.match(/nordstrom/)) {
    $('header').addClass('nordstrom')
    $('h1').html("i wanna spend <input type='text' value='$20' /> on awesome stuff")
  }

  // spin.js
  var opts = {lines: 7, length: 3, width: 4, radius: 6, corners: 1, rotate: 0, color: '#fff', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto'};
  var opts2 = {lines: 7, length: 3, width: 4, radius: 6, corners: 1, rotate: 0, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto'};
  new Spinner(opts).spin(document.getElementById('spin'));
  new Spinner(opts2).spin(document.getElementById('infinite-load'));

  // keep it in the center
  $('#spin').css({ left: (window.innerWidth/2) + "px" });

  var timer = null;
  $('header input').on('keyup', function(){

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
    $('#main > div').each(function(){
      var tags = $(this).attr('class');
      all.push(tags.split(' '));
    });

    var counts = count(_.flatten(all));
    var groups = _.groupBy(counts, function(a){ return a[1] });
    var by_count = _.flatten(_.toArray(groups)).reverse();
    var res = ['all'];
    for (var i = 1; i < by_count.length; i += 2) { res.push(by_count[i]); }
    return _.reject(res, function(i){ return ['no-transition', 'item', 'isotope-item', 'isotope-hidden'].indexOf(i) > -1 });

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

  // nasty shit for centering
  $('#main').css({ 'width': ($(window).width()/160>>0)*160, 'margin': 'auto' });
  $(window).on('resize', _.throttle(function() {
    $('#main').css({
      'width': ($(window).width()/160>>0)*160,
      'margin': 'auto'
    });
  },500));

  // search logic
  function search(keyword, val, cb){
    $('#spin').fadeIn();
    keyword = 'fashion';
    var mainView, etsys, skimlinks;
    etsys = new TS.Collections.Etsys({ search: keyword, priceRange: [ val[1]*.80, val[1] ] });
    etsys.fetch({update: true});
    // skimlinks = new TS.Collections.Skimlinks({ search: keyword, priceRange: val });
    // skimlinks.fetch({update: true});
    var $window = $(window),
      $document = $(document);

    $(window).on('scroll', _.throttle(function() {
      if( etsys.syncing ) return;
      if( ($document.height()-$window.height()-$window.scrollTop()) < 300 ) return;
      etsys.fetch({update: true});
    }, 500) );

    mainView = new TS.Views.Main({ el: '#main', width: 160, collections: [ etsys ] });
    mainView.on('done', function() { search_callback(); });
  }

  function search_callback(){
    // get rid of the spinner
    $('#spin').fadeOut();

    // populate new tags
    $('.filters ul').empty();
    popular_tags().slice(0,9).forEach(function(tag){
      $('.filters ul').append("<li data-filter=" + tag + ">" + tag + "</li>");
    });

    // attach filter events to the tags
    $('.filters ul li').on('click', function(){
      var filter = "." + $(this).data('filter');
      if ($(this).data('filter') === 'all') { filter = ''; }
      $('#main').isotope({ filter: filter }, function(){
        console.log('done');
      });
    });

    // reset
    $('.settings').on('click', function(){
      $('#main').isotope({ filter: "" }, function(){
        console.log('done');
      });
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

  // email handling
  $('#email .send').on('click', function(){
    var uri = $(this).parent().find('input').val();
    $.ajax({
      type: 'POST',
      data: "email_address=" + uri + "&callback=?",
      url: "http://thriftshopinmailer.herokuapp.com/",
      success: function(){
        $('#email input').val('');
        $('#email .close-reveal-modal').trigger('click');
      }
    })
  });

  // initialize
  var e = jQuery.Event("keyup");
  e.which = 50;
  $("header input").trigger(e);

});

// this is what you'll get if you require('main') somewhere else
return {};

});