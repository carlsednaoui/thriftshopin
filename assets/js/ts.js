window.TS = (function() {

  var TileTemplate = '\
<div class="<%= tags %>">\
<a href="<%= link %>" target="_blank">\
<img src="<%= url %>" />\
<div class="price"><p>$<%= Math.round(price) %></p></div>\
</a>\
</div>\
';

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
        min_price: parseInt(options.priceRange[0], 10),
        max_price: parseInt(options.priceRange[1], 10)
      };
    },

    getTags: function() {
      // console.log('Etsys#getTags:'+this.cid, this, arguments);


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
        sort_on: 'score',
        api_key: 'ikb4982yq9ou5ddb2z2dxa3i'
      });

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });
  
  var Skimlink = Backbone.Model.extend({

    idAttribute: 'productId',

    initialize: function( attributes ) {
      console.log('Etsy#initialize:'+this.cid, this, arguments);
    }
  });

  var Skimlinks = Backbone.Collection.extend({
      
    model: Skimlink,

    url: 'http://api-product.skimlinks.com/query',
    
    categories: [ 114, 115, 116, 117, 118, 119, 123, 124, 125, 126,
    127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 209, 210,
    211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
    224, 225, 226, 227, 228, 229, 232, 233, 234, 235, 250, 251, 252,
    253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 267,
    292, 293, 294, 295, 296, 297, 298, 299, 313, 314, 315, 316, 317,
    318, 319, 320, 321, 323, 324, 325, 326, 327, 326, 327, 328, 329 ].join(' OR '),

    initialize: function(options) {
      // console.log('Etsys#initialize:'+this.cid, this, arguments);

      this.search = {
        keywords: options.search,
        min_price: parseInt(options.priceRange[0], 10),
        max_price: parseInt(options.priceRange[1], 10)
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
      query = options.keywords + ' ' +
        'AND price:[' + options.min_price + ' TO ' + options.max_price + '] ' +
        'AND currency:USD' +
        'AND categoryId:(' + this.categories + ')';

      _.extend(options.data, this.search, {
        q: query,
        format: 'json',
        key: 'bac482a2cd40c96eb22a77f8a4315f6a'
      });

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });

  var Main = Backbone.View.extend({

      initialize: function( options ) {
        // console.log('HomeView.initialize.'+this.cid, this, arguments);

        this.collection = options.collection;

        this.listenTo(this.collection, {
          'add': this.addTiles
        });
      },

      addTiles: function( model, collection, options ) {
        // console.log('HomeView#addTiles.'+this.cid, this, arguments);

        var $el = this.$el,
          url, tags, $tile;

        url = _(model.get('Images')).pluck('url_570xN').first();
        link = model.get('url');
        tags = 'item ' + _(model.get('tags')).map(function(tag) { return tag.replace(' ','-'); }).value().join(' ');
        price = model.get('price');
        $tile = $( _.template(TileTemplate, { tags: tags, url: url, price:price, link: link }) );

        $el.append($tile).isotope( 'appended', $tile ).isotope( 'reLayout' );

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
      Main: Main
    }
  };

})();



