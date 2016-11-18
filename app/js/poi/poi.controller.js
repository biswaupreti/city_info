(function() {
  'use strict';
  angular.module('cityInfo.poi').controller('PoiController', PoiController);

  PoiController.$inject = ['$scope', 'PoiApiFactory', 'PoiAutocompleteService'];

  function PoiController($scope, PoiApiFactory, PoiAutocompleteService) {
    var vm = this;
    vm.poiApi = null;

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

      if ($scope.map !== null) {
        queryObj.bounds = $scope.map.getBounds();
      }
      else if (vm.latestLocation !== null) {
        queryObj.location = vm.latestLocation;
        queryObj.radius = 500;
      }

      return PoiAutocompleteService.getQueryPredictions(queryObj);
    }

    $scope.$watch($scope.attributionContainer, function(newVal, oldVal) {
      if (newVal !== null) {
        PoiApiFactory.createApi($scope.attributionContainer).then(
          function(placesApi) {
            vm.poiApi = placesApi;
          },
          function(rejectReason) {}
        );
      }
    });
  };
})();
