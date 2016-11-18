(function() {
  'use strict';
  angular.module('cityInfo.poi').controller('PoiController', PoiController);

  PoiController.$inject = ['$scope', 'PoiApiFactory', 'PoiAutocompleteService'];

  function PoiController($scope, PoiApiFactory, PoiAutocompleteService) {
    var vm = this;
    vm.poiApi = null;

    vm.latestLocation = null;

    vm.showFavorites = showFavorites;
    vm.getQueryPredictions = getPoiAutoCompleteResults;

    function showFavorites() {
      console.log('Favorites button pressed');
    };

    function getPoiAutoCompleteResults(queryText) {
      if (vm.poiApi === null) {
        return [];
      }

      var queryObj = {
        input: queryText
      };

      //if there is a map in current scope, try to get its bounds for query
      if ($scope.map !== null && $scope.map.getMap() !== null) {
        queryObj.bounds = $scope.map.getMap().getBounds();
      }
      else if (vm.latestLocation !== null) {
        queryObj.location = $scope.map.latestLocation;
        queryObj.radius = 500;
      }

      return PoiAutocompleteService.getQueryPredictions(queryObj);
    }

    $scope.$on('poiAttributionContainerReady', function(e, attributionContainer) {
      if (attributionContainer !== null) {
        PoiApiFactory.createApi(attributionContainer).then(
          function(placesApi) {
            vm.poiApi = placesApi;
          },
          function(rejectReason) {}
        );
      }
    });

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
