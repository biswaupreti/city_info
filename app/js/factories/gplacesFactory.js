(function() {
  'use strict';
  angular.module('cityInfo.factories').factory('PoiApi', ['LoadGoogleMapsApi', '$q', GPlacesFactory]);

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
      },

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
