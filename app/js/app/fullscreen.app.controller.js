(function() {
  'use strict';
  angular.module('cityInfo').controller('FullscreenController', FullscreenController);

  FullscreenController.$inject = ['$scope'];

  function FullscreenController($scope) {
    var vm = this;

    $scope.$on('mapReady', function(e, map){
      e.preventDefault();
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      $scope.$broadcast('poiAttributionContainerReady', map);
    });
  }

})();
