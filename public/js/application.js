var deps = [
    'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'
  , 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min.js'
  , 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js'
  , '/js/backbone.localStorage.js'
  , '/js/ts.js'
  , '/js/isotope.min.js'
  , '/js/spin.min.js'
]

require(deps, function(){
  $(function(){
    console.log('working!')
  });
});