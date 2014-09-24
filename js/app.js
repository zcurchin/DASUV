App = Ember.Application.create();

I18n.locale = 'sr';

var langString ='English';

if(readCookie('lang') === 'en'){
  I18n.locale = 'en';
  langString ='Srpski';
}



// --------------------------------------------------------
// Router
// --------------------------------------------------------

App.Router.map(function() {
  this.route("category", { path: "/category/:category_id" });
  this.route("artist", { path: "/artist/:artist_id" });
  this.route("artwork", { path: "/artwork/:artwork_id" });
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
  },
  deactivate: function() {
    Ember.$('body').removeClass(this.toCssClass());
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
      return data;
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
  model: function() {
    return $.getJSON('services/api.php', {
      'method': 'getText',
      'lang': I18n.locale,
      'id': 1 
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














