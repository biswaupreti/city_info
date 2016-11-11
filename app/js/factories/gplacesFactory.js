(function() {
  'use strict';
  angular.module('cityInfo.factories').factory('PoiApiFactory', ['LoadGoogleMapsApi', '$q', GPlacesFactory]);

  function GPlacesFactory(LoadGoogleMapsApi, $q) {
    return {
      createPlaces: function(attributionContainer) {
        return LoadGoogleMapsApi.then(
          function() {
            var googlePlaces = {};

            //Check that attributionContainer is valid (= Google Maps object or HTML div)
            if (attributionContainer == null) {
              return $q.reject("attributionContainer is null");
            } else if (attributionContainer instanceof google.maps.Map ||
                attributionContainer instanceof HTMLDivElement) {
              googlePlaces.api = new google.maps.places.PlacesService(attributionContainer);
            } else if (attributionContainer.map !== undefined && attributionContainer.map instanceof google.maps.Map) {
              googlePlaces.api = new google.maps.places.PlacesService(attributionContainer.map);
            } else {
                return $q.reject("attributionContainer is null");
            }

            //API functions
            googlePlaces.searchWithDetails = function(queryObj, callback) {
              this.api.nearbySearch(queryObj, callback);
            };

            googlePlaces.search = function(queryObj, callback) {
              this.api.radarSearch(queryObj, callback);
            };

            googlePlaces.getDetails = function(queryObj, callback) {
              if ((typeof queryObj) === 'string') {
                this.api.getDetails({ placeId: queryObj }, callback);
              }
              else {
                this.api.getDetails(queryObj, callback);
              }
            };

            return (googlePlaces);
          },
          function(rejectReason){
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
