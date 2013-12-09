'use strict';

var EXTENSION = 'extension';
var THEME = 'theme';

(function(){
  
  var normalize = function(s) {
    return (s || "").toUpperCase();
  };

  var getSuggestions = function(query, callback) {
    query = normalize(query);
    
    chrome.management.getAll(function (extensions) {
      
      var suggestions = _(extensions)
        .filter(function (x) {
            return x.type != EXTENSION && x.type != THEME && x.enabled;
        })
        .filter(function(x){
            return normalize(x.name).indexOf(query) != -1;
        })
        .map(function(x){
            return { content: x.id, description: x.name };
        })
        .value();
        
        callback(suggestions);
        
      });
  };

  chrome.omnibox.onInputChanged.addListener(function(text, suggest) {

      var q = (text || "").toUpperCase();

      getSuggestions(q, suggest);
  });

  chrome.omnibox.onInputEntered.addListener(function(text) {
    chrome.management.launchApp(text);
  });

}());
