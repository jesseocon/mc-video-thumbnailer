angular.module('mcVideoThumbnailSettings', [])
  .provider('mcVideoThumbnailSettings', function() {
    var _defaults = {
      max_thumbnails: 10,
      thumbnail_interval: 1000
    }
       , _settings
       , getSettings = function() {
         if(!_settings) {
           _settings = angular.copy(_defaults);
         };

         return _settings;
       };

    this.set = function(prop, value) {
      var s = getSettings();
      if (angular.isObject(prop)) {
        angular.extend(s, prop);
      } else {
        s[prop] = value;
      }
      return this;
    }

    this.$get = getSettings;

    return this;
  });
