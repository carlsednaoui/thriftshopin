window.TS = (function() {

  var Etsy = Backbone.Model.extend({

    idAttribute: 'listing_id',

    initialize: function( attributes ) {
      // console.log('Etsy#initialize:'+this.cid, this, arguments);
    }
  });

  var Etsys =  Backbone.Collection.extend({
    
    model: Etsy,

    url: 'http://openapi.etsy.com/v2/listings/active.js',
    
    initialize: function(options) {
      // console.log('Etsys#initialize:'+this.cid, this, arguments);

      this.search = {
        keywords: options.search,
        min_price: options.priceRange[0],
        max_price: options.priceRange[1]
      };
    },

    parse: function(resp, options) {
      // console.log('Etsys#parse:'+this.cid, this, arguments);
      return resp.results;
    },

    fetch: function(options) {
      // console.log('Etsys#fetch:'+this.cid, this, arguments);

      options = options || {};
      options.data = options.data || {};
      options.dataType = 'jsonp';

      _.extend(options.data, this.search, {
        includes: 'Images',
        api_key: 'ikb4982yq9ou5ddb2z2dxa3i'
      });

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });
  
  var Skimlink = Backbone.Model.extend({

    idAttribute: 'productId',

    initialize: function( attributes ) {
      // console.log('Etsy#initialize:'+this.cid, this, arguments);
    }
  });

  var Skimlinks = Backbone.Collection.extend({
      
    model: Skimlink,

    url: 'http://api-product.skimlinks.com/query',
    
    initialize: function(options) {
      // console.log('Etsys#initialize:'+this.cid, this, arguments);

      this.search = {
        keywords: options.search,
        min_price: options.priceRange[0],
        max_price: options.priceRange[1]
      };

    },

    parse: function(resp, options) {
      // console.log('Etsys#parse:'+this.cid, this, arguments);

      return resp.results;
    },

    fetch: function(options) {
      // console.log('Etsys#fetch:'+this.cid, this, arguments);

      var query;

      options = options || {};
      options.data = options.data || {};
      options.dataType = 'jsonp';
      query = options.keywords + ' AND price: [' + options.min_price + ' TO ' + options.max_price + ']';

      _.extend(options.data, this.search, {
        q: query,
        format: 'json',
        key: 'bac482a2cd40c96eb22a77f8a4315f6a'
      });

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });

  var Tiles = Backbone.View.extend({
    
      el: '#home',

      events: {
        'keydown #searchbox': 'submit'
      },

      initialize: function( options ) {
        // console.log('HomeView.initialize.'+this.cid, this, arguments);
      },

      addEtsy: function( model, collection, options ) {
        // console.log('HomeView#addEtsy.'+this.cid, this, arguments);

        var tile = new TileView({
          model: model,
          collection: collection
        });

        _(model.get('Images'))
          .pluck('url_570xN')
          .each(function(url) {
            $('#home').append('<img src="'+url+'">');
          });

      },

      submit: function(e) {
        // console.log('HomeView.submit.'+this.cid, this, arguments);
        if ( e !== void 0 && e.keyCode !== 13 ) return;

        var etsys = new Etsys({
          keywords: $(e.currentTarget).val(),
          priceRange: [ 0, 20 ]
        });

        this.listenTo( etsys, {
          'add': this.addEtsy
        });

        etsys.fetch({update: true});
      },

      render: function( model, collection, options ) {
        // console.log('HomeView.render.'+this.cid, this, arguments);

        return this;
      },

      teardown: function() {
        // console.log('HomeView.cleanup.'+this.cid, this, arguments);
        
        return this;
      }
  });

  return {
    Models: {
      Etsy: Etsy,
      Skimlink: Skimlink
    },

    Collections: {
      Etsys: Etsys,
      Skimlinks: Skimlinks
    },

    Views: {
      Tiles: Tiles
    }
  };

})();



