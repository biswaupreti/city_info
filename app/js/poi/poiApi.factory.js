(function() {
  'use strict';
  angular.module('cityInfo.poi').factory('PoiApiFactory',GPlacesFactory);

  GPlacesFactory.$inject =  ['LoadGoogleMapsApi', '$q'];

  function GPlacesFactory(LoadGoogleMapsApi, $q) {
    return {
      createApi: function(attributionContainer) {
        return LoadGoogleMapsApi.then(
          function() {
            var api = null;
            //Check that attributionContainer is valid (= Google Maps object or HTML div)
            if (attributionContainer == null) {
              return $q.reject("attributionContainer is null");
            } else if (attributionContainer instanceof google.maps.Map ||
                attributionContainer instanceof HTMLDivElement) {
              api = new google.maps.places.PlacesService(attributionContainer);
            } else if (attributionContainer.map !== undefined && attributionContainer.map instanceof google.maps.Map) {
              api = new google.maps.places.PlacesService(attributionContainer.map);
            } else {
                return $q.reject("attributionContainer is null");
            }

            var googlePlaces = {
              searchWithDetails: searchWithDetails,
              search: search,
              getDetails: getDetails,

            };
            return googlePlaces;

            function searchWithDetails(queryObj, callback) {
              api.nearbySearch(queryObj, callback);
            };

            function search(queryObj, callback) {
              api.radarSearch(queryObj, callback);
            };

            function getDetails(queryObj, callback) {
              if ((typeof queryObj) === 'string') {
                api.getDetails({ placeId: queryObj }, callback);
              }
              else {
                api.getDetails(queryObj, callback);
              }
            };

          },
          function(rejectReason){
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
