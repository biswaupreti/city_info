(function() {
  'use strict';
  angular.module('cityInfo.factories').factory('PoiAutocompleteFactory', ['LoadGoogleMapsApi', '$q', GPlacesAutocompleteFactory]);

  function GPlacesAutocompleteFactory(LoadGoogleMapsApi, $q) {
    return {
      createAutoCompleteService: function(mapToBind) {
        return LoadGoogleMapsApi.then(
          function(){
            var results = [];
            var boundMap = mapToBind;

            var bounds = null;

            var boundLocation = null;
            var boundArea = null;

            var api = new google.maps.places.AutocompleteService();

            var autoComplete = {
              bindToMapArea: bindToMapArea,
              bindToBounds: bindToBounds,
              getPlacePredictions: getPlacePredictions,
              getQueryPredictions: getQueryPredictions,
              getResults: getResults,

            };
            return autoComplete;

            function bindToMapArea(map) {
              boundMap = map;
            };

            function bindToBounds(bounds) {
              bounds = bounds;
            };

            function bindToLocation(latLng, radius) {
              center = latLng;
              radius = radius;
            };

            function getPlacePredictions(query) {
              return handleQuery(query, 'getPlacePredictions');
            };

            function getQueryPredictions(query) {
              return handleQuery(query, 'getQueryPredictions');
            };

            function getResults() {
              return results;
            }

            function createRequest(userQuery) {
              var queryObj = {};

              if (boundMap != null) {
                queryObj.bounds = boundMap.getBounds();
              }
              else if (bounds != null) {
                queryObj.bounds = bounds;
              }
              else if (center != null) {
                queryObj.location = center;
                if (autoComplete.radius != null) {
                  queryObj.radius = radius;
                }
              }

              queryObj.input = userQuery;
              return queryObj;
            };

            function handleQuery(queryStr, queryFuncName) {
              var deferred = $q.defer();

              var request = createRequest(queryStr);
              api[queryFuncName](request, function(resultsArr, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  deferred.resolve(resultsArr);
                }
                else {
                  deferred.reject(status);
                }
              });

              return deferred.promise;
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
