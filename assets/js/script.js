requirejs.config({
  deps: [
    'jquery',
    'underscore',
    'backbone',
    'jquery-isotope',
    'spin'
  ],
  paths: {
    'jquery-isotope': '/js/isotope.min',
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
    'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min',
    'spin': '/js/spin.min',
    'analytics': '/js/analytics'
  },
  shim: {
    spin: {
      exports: 'Spinner'
    },
    jquery: {
      exports: '$'
    },
    'jquery-isotope': {
      deps: [ 'jquery' ],
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [ 'underscore', 'jquery-isotope' ],
      exports: 'Backbone'
    }
  }
});

require([ 'main', 'ts' ], function( main, ts ) {


  // $(document).ready(function() {
  //   Backbone.history.start({pushState: true});
  // });

});
