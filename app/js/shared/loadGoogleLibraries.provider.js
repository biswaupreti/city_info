(function() {
  'use strict';
  angular.module('cityInfo.shared').provider('LoadGoogleMapsApi', LoadGoogleMapsApiProvider);

  function LoadGoogleMapsApiProvider() {
      var myConfig = {
        baseUrl: 'https://maps.googleapis.com/maps/api/js',
        apiKey: null,
        libraries: null,
        language: 'en'
      };

      this.setConfig = function(config) {
        angular.extend(myConfig, config);
      }

      this.$get = function($window, $q) {
        var deferred = $q.defer();

        function loadGMapsScript() {
          if (myConfig.baseUrl == null) {
            console.log('No Google Maps API URL defined, check Angular config!');
            deferred.reject('No Google Maps API URL');
          }
          else if (myConfig.apiKey == null) {
            console.log('No Google Maps API Key defined, check Angular config!');
            deferred.reject('No Google Maps API Key');
          }
          else {
            var fullUrl = myConfig.baseUrl + '?key=' + myConfig.apiKey;
            if (myConfig.libraries != null) {
              fullUrl += '&libraries=' + myConfig.libraries.join(',');
            }
            if (myConfig.language != null) {
              fullUrl += '&language=' + myConfig.language;
            }

            fullUrl += '&callback=googlemapsapisloaded';

            var scriptElem = document.createElement('script');
            scriptElem.async = true;
            scriptElem.type = 'text/javascript';
            scriptElem.src = fullUrl;

            document.body.appendChild(scriptElem);
          }
        };

        $window.googlemapsapisloaded = function() {
          deferred.resolve();
        };

        if ($window.attachEvent) {
          $window.attachEvent('onload', loadGMapsScript);
        } else {
          $window.addEventListener('load', loadGMapsScript, false);
        }

        return deferred.promise;
      };

      this.$get.$inject = ['$window', '$q'];
  };
})();
