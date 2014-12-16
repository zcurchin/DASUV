App = Ember.Application.create();

I18n.locale = 'sr';

var langString ='English';

if(readCookie('lang') === 'en'){
  I18n.locale = 'en';
  langString ='Srpski';
}

bgIndex = 1;



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

      var base_url = window.location.origin + window.location.pathname;      

      if (model.files === 1 ||  model.files === 0){
        var img_obj = {};        
        img_obj.path = base_url + 'media/'+ data.artwork.id +'/thumb.jpg';
        img_obj.index = 0;
        model.thumbs.push(img_obj);
      }

      if (data.artwork.files > 1){
        for(var i=1; i <= model.files; i++){
          var img_obj = {};
          img_obj.path = base_url + 'media/'+ data.artwork.id +'/t'+ i +'.jpg';
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
      this.toggleProperty('visibleSearch');      

      if(this.get('visibleCategories')){
        this.toggleProperty('visibleCategories');
      } else {
        this.toggleProperty('fadeContent');
      }
    },
    showHideCategories: function(){
      this.toggleProperty('visibleCategories');

      if(this.get('visibleSearch')){
        this.toggleProperty('visibleSearch');
      } else {
        this.toggleProperty('fadeContent');
      }
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
  actions: {
    openSlider: function(index){
      var thumbs = this.get('model').thumbs;
      console.log(index);
      console.log(thumbs);
    }
  }
});




// --------------------------------------------------------
// Views
// --------------------------------------------------------

var SearchBoxView = Ember.View.extend({
  templateName: 'search-box',
  className: 'search-box',
  keyUp: function() {
    var query = this.get('controller.searchValue');
    inputSearchDelay(function(){      
      if(query.length > 2){
        return $.getJSON('services/api.php', {
          'method': 'getSearchResults',
          'lang': I18n.locale
        }).then(function(data) {      
          return data;
        });
      }
    }, 300);    
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














