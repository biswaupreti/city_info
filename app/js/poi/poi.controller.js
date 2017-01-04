(function() {
  'use strict';
  angular.module('cityInfo.poi').controller('PoiController', PoiController);

  PoiController.$inject = ['$scope', 'PoiApiFactory', 'PoiAutocompleteService'];

  function PoiController($scope, PoiApiFactory, PoiAutocompleteService) {
    var vm = this;
    vm.poiApi = null;

    vm.latestLocation = null;
    vm.searchText = "";
    vm.selectedItem = null;

    vm.searchForItem = searchForItem;
    vm.searchForPoi = searchForPoi;
    vm.getQueryPredictions = getPoiAutoCompleteResults;

    $scope.$on('poiAttributionContainerReady', onAttributionContainerReady);

    function searchForItem(item) {
      if (item !== null) {
        searchForPoi(item);
      }
      else if (vm.searchText === "") {
        $scope.clearSearchResults();
      }
    }

    function searchForPoi(query) {
      if (query !== null && query !== "") {
        //is query autocomplete object for single POI, or multiple POIS / free text
        if (query.id) {
          //Query is object for single POI
          searchPoiDetails(query, handlePoiSearchResults);
        }
        else {
          //Query is object for multiple POIs or free text
          var queryStr = (typeof query) === 'string' ? query : query.description;
          var queryObj = {
            keyword: queryStr
          };
          fillQueryLocationInfo(queryObj);

          vm.poiApi.searchWithDetails(queryObj, handlePoiSearchResults);
        }
      }
      else {
        $scope.clearSearchResults();
      }
    }

    function searchPoiDetails(poi, callback) {
      vm.poiApi.getDetails(poi, callback);
    }

    function handlePoiSearchResults(result, statusCode) {
      if (statusCode === vm.poiApi.Status.OK) {
        if (!Array.isArray(result)) {
          result.hasDetails = true;
          result = [result];
        }
        else {
          for (var i = 0; i < result.length; ++i) {
            var poi = result[i]
            poi.hasDetails = false;
            poi.getDetails = createDetailFunctionForPoi(poi);
          }
        }

        $scope.showSearchResults(result);
      }
      else if (statusCode === vm.poiApi.Status.ZERO_RESULTS) {
        $scope.showSearchResults([]);
      }
      else {
        console.log("Problem with POI query, status: " + statusCode);
      }
    }

    function createDetailFunctionForPoi(poi) {
      return function() {
        searchPoiDetails(poi, function(detailResult, statusCode){
          if (statusCode == vm.poiApi.Status.OK) {
            $scope.$apply(function(){
              angular.extend(poi, detailResult);

              //force attribution links to open in a new window
              var photoArr = poi.photos;
              if (photoArr !== undefined) {
                for (var i = 0; i < photoArr.length; ++i) {
                  var attributions = photoArr[i].html_attributions;
                  for (var j = 0; j < attributions.length; ++j) {
                    attributions[j] = attributions[j].slice(0, 2) + " target='_blank' " + attributions[j].slice(2);
                  }
                }
              }

              poi.hasDetails = true;
            });
          }
        });
      }
    }

    function getPoiAutoCompleteResults(queryText) {
      if (vm.poiApi === null) {
        return [];
      }

      var queryObj = {
        input: queryText
      };

      fillQueryLocationInfo(queryObj);
      return PoiAutocompleteService.getQueryPredictions(queryObj);
    }

    function fillQueryLocationInfo(queryObj) {
      //if there is a map in current scope, try to get its bounds for query
      if ($scope.map !== null && $scope.map.getMap() !== null) {
        queryObj.bounds = $scope.map.getMap().getBounds();
      }
      else if (vm.latestLocation !== null) {
        queryObj.location = $scope.map.latestLocation;
        queryObj.radius = 500;
      }
    }

    function onAttributionContainerReady(e, attributionContainer) {
      if (attributionContainer !== null) {
        PoiApiFactory.createApi(attributionContainer).then(
          function(placesApi) {
            vm.poiApi = placesApi;
          },
          function(rejectReason) {}
        );
      }
    }

    //listen to location as a fallback if no map is present
    llb_app.addListener('location', function(data){
      var latLng = {};
      //Quick fix so that listener works with both custom events and actual events
      if (data.data) {
        latLng.lat = data.data.latitude;
        latLng.lng = data.data.longitude;
      }
      else {
        latLng.lat = data.latitude;
        latLng.lng = data.longitude;
      }

      vm.latestLocation = latLng;
    });
    llb_app.request('location');
  };
})();
