define(function(require) {

  var Backbone = require('backbone');

    var TileTemplate = '\
<div class="item <%= tags %>">\
<a href="<%= link %>" target="_blank">\
<img src="<%= url %>" width="<%= width %>" height="<%= height %>" />\
<div class="price"><p>$<%= Math.round(price) %></p></div>\
</a>\
<ul class="social">\
  <li class="twitter">\
    <a href="http://twitter.com/home?status=<%= link %> - via thriftshop.in" target="_blank"></a>\
  </li>\
  <li class="fbook">\
    <a href="https://www.facebook.com/sharer.php?t=<%= name %>&u=<%= link %> - via thriftshop.in" target="_blank"></a>\
  </li>\
  <li class="pinterest">\
    <a href="http://pinterest.com/pin/create/button/?url=<%= link %>&media=<%= url %>&description=<%= name %> via thriftshop.in" target="_blank"></a>\
  </li>\
</ul>\
</div>\
';

    var Etsy = Backbone.Model.extend({

      idAttribute: 'listing_id',

      initialize: function( attributes ) {
        // console.log('Etsy#initialize:'+this.cid, this, arguments);
        // this.scale = this.collection.search.min_price/this.collection.search.max_price;

        // this.scale = parseInt(this.get('price'),10) !== this.collection.search.max_price ? 0.5 : 1;
      },

      getTags: function() {
        // console.log('Etsys#getTags:'+this.cid, this, arguments);
        return _(this.get('tags')).map(function(tag) { return tag.replace(' ','-'); }).value();
      },

      getPrice: function() {
        return this.get('price');
      },

      getPriceScaling: function() {
        // return this.collection.
      },

      getImage: function(width) {
        var image = _(this.get('Images')).first();
        // width = (this.scale || 1) * width;
        return {
          url: image['url_170x135'],
          width: 170,
          height: 135
          // width: width,
          // height: ((570*image.full_height)/image.full_width * width)/570 >> 0

        };
      },

      getLink: function() {
        return this.get('url');
      },

      getName: function(){
        return this.get('title');
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
      318, 319, 320, 321, 323, 324, 325, 326, 327, 326, 327, 328, 329 ],

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
          'AND categoryId:(' + this.categories.join(' OR ') + ')';

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

          this.collections = _.isArray(options.collections) ? options.collections : [ options.collections ];

          var $el = this.$el;

          if( $el.hasClass('isotope') ) {
            $el.isotope('destroy').empty();
          }

          $el.isotope({
            itemSelector : '.item',
            layoutMode : 'masonry'
          });

          _.each(this.collections, function(collection) {
            this.listenTo(collection, 'add', this.addTiles);
            this.listenTo(collection, 'sync', this.onSync);
          }, this);
        },

        onSync: function( collection, options ) {
          // console.log('HomeView#sync.'+this.cid, this, arguments);
          this.$el.isotope( 'reLayout' );
          this.trigger('done');
        },

        addTiles: function( model, collection, options ) {
          // console.log('HomeView#addTiles.'+this.cid, this, arguments);

          var $el = this.$el,
            image, tags, $tile;

          image = model.getImage(this.options.width);
          tags = model.getTags().join(' ');
          price = model.getPrice();
          link = model.getLink();
          name = model.getName();
          $tile = $( _.template(TileTemplate, { tags: tags, url: image.url, width: image.width, height: image.height, link: link, price: price, name: name }) );

          $el.append($tile).isotope( 'appended', $tile );

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
});