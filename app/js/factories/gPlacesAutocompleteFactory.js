(function() {
  'use strict';
  angular.module('cityInfo.factories').factory('PoiAutocompleteFactory', ['LoadGoogleMapsApi', '$q', GPlacesAutocompleteFactory]);

  function GPlacesAutocompleteFactory(LoadGoogleMapsApi, $q) {
    return {
      createAutoCompleteService: function(mapToBind) {
        return LoadGoogleMapsApi.then(
          function(){
            var autoComplete = {
              results: [],
              api: new google.maps.places.AutocompleteService()
            };

            autoComplete.bindToMapArea = function(map) {
                autoComplete.boundMap = map;
            };

            autoComplete.bindToBounds = function(bounds) {
                autoComplete.bounds = bounds;
            };

            autoComplete.bindToLocation = function(latLng, radius) {
                autoComplete.center = latLng;
                autoComplete.radius = radius;
            };

            autoComplete.getPlacePredictions = function(query) {
                return handleQuery(query, 'getPlacePredictions');
            };

            autoComplete.getQueryPredictions = function(query) {
                return handleQuery(query, 'getQueryPredictions');
            };

            autoComplete.getResults = function() {
              return autoComplete.results;
            }

            function createRequest(userQuery) {
                var queryObj = {};

                if (autoComplete.boundMap != null) {
                  queryObj.bounds = autoComplete.boundMap.getBounds();
                }
                else if (autoComplete.bounds != null) {
                  queryObj.bounds = autoComplete.bounds;
                }
                else if (autoComplete.center != null) {
                  queryObj.location = autoComplete.center;
                  if (autoComplete.radius != null) {
                    queryObj.radius = autoComplete.radius;
                  }
                }

                queryObj.input = userQuery;
                return queryObj;
            };

            function handleQuery(queryStr, queryFuncName) {
                var deferred = $q.defer();

                var request = createRequest(queryStr);
                autoComplete.api[queryFuncName](request, function(resultsArr, status) {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                    deferred.resolve(resultsArr);
                  }
                  else {
                    deferred.reject(status);
                  }
                });

                return deferred.promise;
            };

            if (mapToBind !== null) {
              autoComplete.bindToMapArea(mapToBind);
            }
            return (autoComplete);
          },
          function(rejectReason){
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
