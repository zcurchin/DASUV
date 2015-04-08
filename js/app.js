App = Ember.Application.create();

I18n.locale = 'sr';

var langString ='English';

if(readCookie('lang') === 'en'){
  I18n.locale = 'en';
  langString ='Srpski';
}

bgIndex = 1;

var baseURL = window.location.origin + window.location.pathname;



// --------------------------------------------------------
// Router
// --------------------------------------------------------

App.Router.map(function() {
  this.route("category", { path: "/category/:category_id" });
  this.route("artist", { path: "/artist/:artist_id" });
  this.route("artwork", { path: "/artwork/:artwork_id" });
  this.route("texts", { path: "/texts" });
  this.route("text", { path: "/text/:text_id" });
  this.route("about", { path: "/about" });
});

// this will add class to body accorind to 
// application current state
Ember.Route.reopen({
  activate: function() {
    var cssClass = this.toCssClass();
    // we probably don't need the application class
    // to be added to the body
    if (cssClass != 'application') {
      Ember.$('body').addClass(cssClass);
    }

    if (cssClass === 'index'){
      if (bgIndex === 4) bgIndex = 1;
      
      Ember.$('body').addClass('bg-'+bgIndex);
      bgIndex++;
    }
  },
  deactivate: function() {
    Ember.$('body').removeClass(this.toCssClass());
    
    var bgi = bgIndex-1;
    Ember.$('body').removeClass('bg-'+bgi);
  },
  toCssClass: function() {
    return this.routeName.replace(/\./g, '-').dasherize();
  }
});



// --------------------------------------------------------
// Routes
// --------------------------------------------------------

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('services/api.php', {
      'method': 'getCategories',
      'lang': I18n.locale
    }).then(function(data) {      
      return data;
    });
  }
});

App.CategoryRoute = Ember.Route.extend({
  beforeModel: function(transition){
    Em.$('.listbox-wrapper ul').css('left', '0px');
  },

  model: function(params) {
    return $.getJSON('services/api.php', {
      'method': 'getCategory',
      'lang': I18n.locale,
      'category_id': params.category_id
    }).then(function(data) {      
      return data;
    });
  }
});

App.ArtworkRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('services/api.php', {
      'method': 'getArtwork',
      'lang': I18n.locale,
      'artwork_id': params.artwork_id
    }).then(function(data) {
      var model = data.artwork;      

      // Set Thumbnails

      model.thumbs = [];     

      if (model.files === 1 ||  model.files === 0){
        var img_obj = {};        
        img_obj.path = baseURL + 'media/'+ data.artwork.id +'/thumb.jpg';
        img_obj.index = 0;
        model.thumbs.push(img_obj);
      }

      if (data.artwork.files > 1){
        for(var i=1; i <= model.files; i++){
          var img_obj = {};
          img_obj.path = baseURL + 'media/'+ data.artwork.id +'/t'+ i +'.jpg';
          img_obj.index = i;
          model.thumbs.push(img_obj);
        }
      }
      console.log(model);
      return model;
      
    });
  }
});

App.ArtistRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('services/api.php', {
      'method': 'getArtist',
      'lang': I18n.locale,
      'artist_id': params.artist_id
    }).then(function(data) {      
      return data;
    });
  }
});

App.TextsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('services/api.php', {
      'method': 'getTexts',
      'lang': I18n.locale
    }).then(function(data) {
    console.log(data);      
      return data;
    });
  }
});

App.TextRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('services/api.php', {
      'method': 'getOneText',
      'lang': I18n.locale,
      'text_id': params.text_id 
    }).then(function(data) {      
      return data;
    });
  }
});




// --------------------------------------------------------
// Controllers
// --------------------------------------------------------

App.ApplicationController = Ember.Controller.extend({
  languageStr: langString,
  searchValue: '',
  searchPlaceholder: I18n.t('search_holder'),

  visibleSearch: false,
  visibleCategories: false,

  fadeContent: false,

  actions: {
    query: function() {
      // the current value of the text field
      var query = this.get('search');
      
      if(query > 2){
        console.log(query)
      }
    },
    changeLanguage: function(){
      var currentLang = I18n.locale;

      if(currentLang === 'en'){
        changeLang('sr');
      } else {
        changeLang('en');
      }      
    },
    showHideSearch: function(){
      var self = this;
      this.toggleProperty('visibleSearch');

      $('#search-results').html('');
      $('#search-input').val('');

      if(this.get('visibleCategories')){
        this.toggleProperty('visibleCategories');
      } else {
        this.toggleProperty('fadeContent');
      }

      $(document).unbind('click');
      $(document).click(function(e){
        if ($(e.target).attr('id') !== 'search-btn' && $(e.target).attr('id') !== 'search-input') {
          if ($('#search-box').hasClass('visible-search')) {
            self.set('visibleSearch', false);
          }
        }
      });
      $('#search-input').focus();     
    },
    showHideCategories: function(){
      var self = this;
      this.toggleProperty('visibleCategories');

      if(this.get('visibleSearch')){
        this.toggleProperty('visibleSearch');
      } else {
        this.toggleProperty('fadeContent');
      }

      $(document).unbind('click');
      $(document).click(function(e){
        if ($(e.target).attr('id') !== 'menu-btn') {
          if ($('#category-nav').hasClass('visible-categories')) {
            self.set('visibleCategories', false);
          }
        }
      });
    },
    hideCategories: function(){
      this.toggleProperty('visibleCategories');
      this.set('fadeContent', false);
    }
  }
});


App.ArtistController = Ember.Controller.extend({
  visibleBio: false,
  visibleBib: false,
  actions: {
    toggleBio: function(){
      this.toggleProperty('visibleBio');      

      if(this.get('visibleBib')){
        this.toggleProperty('visibleBib');
      }
    },
    toggleBib: function(){
      this.toggleProperty('visibleBib');      

      if(this.get('visibleBio')){
        this.toggleProperty('visibleBio');
      };
    }
  }
});


App.ArtworkController = Ember.Controller.extend({
  multiple_thumbs: function() {
    var thumbs = this.get('model.thumbs');
    if (thumbs.length > 1) {
      return true;
    } else {
      return false;
    }
  }.property('model.thumbs'),

  image_type: function() {
    var type = this.get('model.media_type');
    if (type === 'img') { return true; } else { return false; }
  }.property('model.media_type'),

  video_type: function() {
    var type = this.get('model.media_type');
    if (type === 'video') { return true; } else { return false; }
  }.property('model.media_type'),

  sound_mp3: null,
  sound_ogg: null,

  sound_type: function() {
    var self = this;
    var type = this.get('model.media_type');
    if (type === 'sound') {
      this.sound_mp3 = baseURL + 'media/' + self.get('model.id') + '/sound.mp3';
      this.sound_ogg = baseURL + 'media/' + self.get('model.id') + '/sound.ogg';
      return true;
    } else { return false; }
  }.property('model.media_type'),

  thumbs_length: function() {
    var thumbs = this.get('model.thumbs');
    return thumbs.length;
  }.property('model.thumbs'),

  current_thumb: 0,
  current_thumb_num: function(){
    return this.current_thumb + 1;
  }.property('current_thumb')

});


App.CategoryController = Ember.Controller.extend({
  enough_artists: function(){
    var numberOfArtists = this.get('model.artists').length;
    var enough = (numberOfArtists > 3) ? true : false;
    return enough;
  }.property('model.artists'),
  
  enough_artworks: function(){
    var numberOfArtworks = this.get('model.artworks').length;
    var enough = (numberOfArtworks > 3) ? true : false;
    return enough;
  }.property('model.artworks'),
  
  actions: {
    getMoreArtists: function(){
      var self = this;
      var category_id = this.get('model.category_id');
      var fromNum = this.get('model.artists').length;

      var spinner_target = document.getElementById('artists-preloader');
      var spinner = new Spinner(small_spinner_opts);
      spinner.spin(spinner_target);
      
      $.getJSON('services/api.php', {
        'method': 'getArtists',
        'lang': I18n.locale,
        'category_id': category_id,
        'fromNum': fromNum
      }).then(function(data) {

        var total = data.category_info[0].total;
        var current = self.get('model.artists').length;

        if (current === total) { 
          Ember.$('#more-artists-btn').hide();
          spinner.stop();
          return;
        } 

        var artists = self.get('model.artists');

        $.each(data.artists, function(k,v){
          var id = v.artist_id; delete v.artist_id; v.id = id;
          artists.pushObject(v);   
        });

        var list_el = Ember.$('#artists-list');
        var items = list_el.find('li');
        var item_width = items[0].offsetWidth;
        var items_total = artists.length;
        var list_width = items_total * item_width;
        
        var list_left_num = (artists.length * item_width) - (4 * item_width);
        var list_left = '-' + list_left_num + 'px';
        console.log(list_left);

        list_el.css( 'width', list_width );

        self.set('model.artists', artists);

        Ember.$('.artists-list .icon-arr-right').hide();

        imagesLoaded(list_el, function(){
          list_el.css( 'left', list_left);
          Ember.$('.artists-list .icon-arr-left').show();
          spinner.stop();        
        });

      });
    },

    getMoreArtworks: function(){
      var self = this;
      var category_id = this.get('model.category_id');
      var fromNum = this.get('model.artworks').length;

      var spinner_target = document.getElementById('artworks-preloader');
      var spinner = new Spinner(small_spinner_opts);
      spinner.spin(spinner_target);
      
      $.getJSON('services/api.php', {
        'method': 'getArtworks',
        'lang': I18n.locale,
        'category_id': category_id,
        'fromNum': fromNum
      }).then(function(data) {

        var total = data.category_info[0].total;
        var current = self.get('model.artworks').length;

        if (current === total) { 
          Ember.$('#more-artworks-btn').hide();
          spinner.stop();
          return;
        } 

        var artworks = self.get('model.artworks');

        $.each(data.artworks, function(k,v){
          var id = v.artwork_id; delete v.artwork_id; v.id = id;
          artworks.pushObject(v);   
        });

        var list_el = Ember.$('#artworks-list');
        var items = list_el.find('li');
        var item_width = items[0].offsetWidth;
        var items_total = artworks.length;
        var list_width = items_total * item_width;
        
        var list_left_num = (artworks.length * item_width) - (4 * item_width);
        var list_left = '-' + list_left_num + 'px';
        console.log(list_left);

        list_el.css( 'width', list_width );

        self.set('model.artworks', artworks);

        Ember.$('.artworks-list .icon-arr-right').hide();

        imagesLoaded(list_el, function(){
          list_el.css( 'left', list_left);
          Ember.$('.artworks-list .icon-arr-left').show();
          spinner.stop();        
        });

      });
    },

    scrollLeft_artists: function(){
      scrollListLeft('artists');
    },

    scrollRight_artists: function(){
      scrollListRight('artists');
    },

    scrollLeft_artworks: function(){
      scrollListLeft('artworks');
    },

    scrollRight_artworks: function(){
      scrollListRight('artworks');
    }
  }
});


// --------------------------------------------------------
// Views
// --------------------------------------------------------

var SearchBoxView = Ember.View.extend({
  templateName: 'search-box',
  keyUp: function() {
    var self = this;
    var query = this.get('controller.searchValue');
    var results_el = $('#search-results');
    results_el.html('');
    inputSearchDelay(function(){      
      if(query.length > 2){
        return $.getJSON('services/api.php', {
          'method': 'getSearchResults',
          'lang': I18n.locale,
          'keyword': query
        }).then(function(data) {
          if (!data.artists && !data.artworks && !data.texts){
            results_el.append('<p class="no-results">' + I18n.t('no_results') + '</p>');
          } else {
            if (data.artists) {
              $.each(data.artists, function(k, v){
                var tmpl = '' +
                  '<a href="'+baseURL+'#/artist/'+v.id+'">' +
                    '<div class="artist-result clearfix"><img src="'+baseURL+'avatars/'+v.id+'.jpg"/>' +
                      '<p>'+v.name+'</p>' +
                    '</div>' +
                  '</a>';
                results_el.append(tmpl);            
              });
            }
            if (data.artworks) {
              $.each(data.artworks, function(k, v){
                var tmpl = '' +
                  '<a href="'+baseURL+'#/artwork/'+v.id+'">' +
                    '<div class="artwork-result clearfix"><img src="'+baseURL+'media/'+v.id+'/thumb.jpg"/>' +
                      '<p>'+v.title+'</p>' +
                      '<p class="author">'+v.author+'</p>' +
                    '</div>' +
                  '</a>';
                results_el.append(tmpl);            
              });
            } 
            results_el.click(function(){
              self.set('controller.visibleSearch', false);
              self.set('controller.fadeContent', false);
            });
          }      
        });
      }
    }, 600);    
  }
});


var ArtworkPreviewBoxView = Ember.View.extend({
  templateName: 'artwork-preview-box',
  classNames: ['artwork-preview-box'],

  slider_el: null,

  didInsertElement: function(){
    var slider_width = this.get('controller.thumbs_length') * 250;
    this.slider_el = this.$('#artwork-slider');
    this.slider_el.css('width', slider_width);
    this.set('controller.current_thumb', 0);
  },

  actions: {
    openFullScreen: function(type, index){
      console.log('type: ' + type + ' index: ' + index);
      var artwork_id = this.get('controller.model.id'),
          path = baseURL + 'media/' + artwork_id,
          total_artworks = this.get('controller.thumbs_length'),
          viewport_width = $(window).width(),
          viewport_height = $(window).height();

      $('body').append('<div id="full-screen">');      
      var fs_view_el = $('#full-screen');
      fs_view_el.css({
        'width': viewport_width,
        'height': viewport_height
      });

      fs_view_el.append('<span id="fs-close-btn" class="icon-ex"></span>');

      var spinner_target = document.getElementById('full-screen');
      var spinner = new Spinner(spinner_opts);
      spinner.spin(spinner_target);      

      $('#fs-close-btn').click(function(){
        fs_view_el.remove();
      });

      //$('html').keydown(function(e){});

      var tmpl = '';

      // -------------------------
      // Image
      // -------------------------

      if (type === 'img') {
        tmpl += '<div id="fs-slider" class="clearfix">';
        
        for (i=0; i < total_artworks; i++){
          var num = i + 1;
          tmpl += '<div class="fs-slide"><img src="'+ path +'/'+ num +'.jpg" /></div>';        
        }      

        tmpl += '</div>';

        fs_view_el.append(tmpl);

        var fs_slider_el = $('#fs-slider');
        var fs_slide_el = fs_slider_el.find('.fs-slide');

        fs_slide_el.css({
          'width': viewport_width,
          'height': viewport_height
        });        

        imagesLoaded(fs_slider_el, function(){
          var images = fs_slider_el.find('img');
          var slider_aspect = viewport_width / viewport_height;

          for (i=0; i < images.length; i++){
            var image = images[i],
                img_w = image.naturalWidth,
                img_h = image.naturalHeight,
                img_aspect = img_w / img_h,
                imageW,
                imageH;

            if (img_w <= viewport_width - 40 && img_h <= viewport_height - 40) {
              imageW = img_w;
              imageH = img_h;
            } else if (img_aspect === 1) {
              imageW = viewport_width - 40;
              imageH = viewport_height - 40;
            } else if (img_aspect > 1) {
              if (img_aspect <= slider_aspect){
                imageW = viewport_height - 40;
                imageH = imageH * img_aspect;
              } else {
                imageW = viewport_width - 40;
                imageH = imageW / img_aspect;          
              }
            } else if (img_aspect < 1) {
              imageH = (viewport_height - 40);
              imageW = imageH * img_aspect;
            }

            $(image).css({'width': imageW, 'height': imageH});
          }

          if (total_artworks > 1) {
            ctrls = '';
            ctrls += '<div id="fs-slider-ctrls" class="clearfix">';
            ctrls +=   '<span id="fs-prev-btn" class="icon-arr-left fs-ctrl"></span>';
            ctrls +=   '<span id="fs-next-btn" class="icon-arr-right fs-ctrl"></span>';
            ctrls += '</div>';

            fs_view_el.append(ctrls);
            $('#fs-prev-btn, #fs-next-btn').css('top', viewport_height / 2 - 35);

            var total = total_artworks;
            var current;
            if (index === 1) current = 0;
            if (index > 1) current = index - 1;

            $('#fs-prev-btn').click(function(){
              console.log(current);
              if (current > 0) {
                current--;
                var left = viewport_width * current * -1;
                console.log(current, left);              
                fs_slider_el.animate({'left': left}, 300);
              }
            });

            $('#fs-next-btn').click(function(){
              console.log(current);
              if (current !== total_artworks - 1) {
                current++;
                var left = viewport_width * current * -1;
                console.log(current, left);              
                fs_slider_el.animate({'left': left}, 300);
              }
            });

            $(document).keyup(function(e) {
              if (e.keyCode == 27) $('#fs-close-btn').trigger('click');  // esc
              if (e.keyCode == 37) $('#fs-prev-btn').trigger('click');   // left
              if (e.keyCode == 39) $('#fs-next-btn').trigger('click');   // right
            });
          }

          if (index > 1) {
            fs_slider_el.css('left', viewport_width * (index - 1) * -1);
          }
          
          spinner.stop();
          fs_slider_el.animate({'opacity': 1}, 300);
        });

      // -------------------------
      // Video
      // -------------------------
                
      } else if (type === 'video') {
        var videoId = this.get('controller.model.video_id');
        console.log(videoId);
        tmpl += '<div id="fs-video">';
        tmpl +=   '<iframe src="//player.vimeo.com/video/'+videoId+'" width="640" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        tmpl += '</div>';

        spinner.stop();
        fs_view_el.append(tmpl);
      }

      // -------------------------
      // Sound
      // -------------------------

      else if (type === 'sound') {
        tmpl += '<div id="fs-audio">';
        tmpl +=   '<audio controls autoplay>';
        tmpl +=     '<source src='+this.get('controller.sound_mp3')+' type="audio/ogg">';
        tmpl +=     '<source src='+this.get('controller.sound_ogg')+' type="audio/mpeg">';
        tmpl +=   '</audio>';
        tmpl += '</div>';

        spinner.stop();
        fs_view_el.append(tmpl);      
      }

    },

    prevThumb: function(){
      var current_thumb = this.get('controller.current_thumb_num'),
          total_thumbs = this.get('controller.thumbs_length');
      
      if (current_thumb > 1) {
        this.decrementProperty('controller.current_thumb');
        var left = this.get('controller.current_thumb') * 250 * -1;
        this.slider_el.animate({'left':left}, 300);
      }
    },

    nextThumb: function(){
      var current_thumb = this.get('controller.current_thumb_num'),
          total_thumbs = this.get('controller.thumbs_length');

      if (current_thumb !== total_thumbs) {
        this.incrementProperty('controller.current_thumb');
        var left = this.get('controller.current_thumb') * 250 * -1;      
        this.slider_el.animate({'left':left}, 300);        
      }
    }
  }
});




// --------------------------------------------------------
// Handlebars Helpers
// --------------------------------------------------------

Ember.Handlebars.registerHelper('i18n', function(property, options) {
  var params = options.hash,
      self = this;

  // Support variable interpolation for our string
  Object.keys(params).forEach(function (key) {
    params[key] = Em.Handlebars.get(self, params[key], options);
  });

  return I18n.t(property, params);
});



// --------------------------------------------------------
// Helper Functions
// --------------------------------------------------------

function changeLang(lang){
  if(lang === 'en'){
    createCookie('lang','en',7);
    I18n.locale = 'en';
  } else {
    eraseCookie('lang');
    I18n.locale = 'sr';
  }

  window.location.reload();
}

// Keyup delay
var inputSearchDelay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();


function scrollListLeft(type){
  var list_el, button_left_el, button_right_el;
  if (type === 'artists') {
    list_el = $('#artists-list');
    button_left_el = $('.artists-list .icon-arr-left');
    button_right_el = $('.artists-list .icon-arr-right');
  } else {
    list_el = $('#artworks-list');
    button_left_el = $('.artworks-list .icon-arr-left');
    button_right_el = $('.artworks-list .icon-arr-right');
  }

  var item_width = list_el.find('li')[0].offsetWidth;
  var list_width = list_el.length * item_width;
  var current_left_string = list_el.css('left');
  var current_left_number = parseInt(current_left_string.slice(0, - 2));

  console.log(-current_left_number);
  console.log(item_width*4);
  
  button_right_el.show();

  if (-current_left_number <= item_width * 4) {
    list_el.css('left', '0px');
    button_left_el.hide();
  } else {
    var leftPos_num = -current_left_number - item_width * 4;
    var leftPos = '-'+leftPos_num+'px';
    list_el.css('left', leftPos);
  }
}

function scrollListRight(type){
  var list_el, button_left_el, button_right_el;
  if (type === 'artists') {
    list_el = $('#artists-list');
    button_left_el = $('.artists-list .icon-arr-left');
    button_right_el = $('.artists-list .icon-arr-right');
  } else {
    list_el = $('#artworks-list');
    button_left_el = $('.artworks-list .icon-arr-left');
    button_right_el = $('.artworks-list .icon-arr-right');
  }

  var item_width = list_el.find('li')[0].offsetWidth;
  var list_width = list_el.width();
  var items_width = item_width * 4;
  var current_left_string = list_el.css('left');
  var current_left_number = parseInt(current_left_string.slice(0, - 2));
  var current_left = (current_left_number === 0) ? 0 : -current_left_number;

  console.log(current_left);
  console.log(list_width);
  
  button_left_el.show();

  if (list_width - (current_left + items_width) > items_width) {
    var leftPos_num = current_left + items_width;
    var leftPos = '-'+leftPos_num+'px';
    list_el.css('left', leftPos);
  } else if (list_width - (current_left + items_width) <= items_width){
    var leftPos_num = current_left + (list_width - (current_left + items_width));
    var leftPos = '-'+leftPos_num+'px';
    list_el.css('left', leftPos);
    button_right_el.hide();
  }
}
















