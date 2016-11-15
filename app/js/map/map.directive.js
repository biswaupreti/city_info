(function() {
  'use strict';
  angular.module('cityInfo.map').directive('aptMap', MapDirective);

  MapDirective.$inject = ['MapFactory'];

  function MapDirective(MapFactory) {
    return {
      restrict: 'E',
      replace: true,
      controller: MapDirectiveController,
      link: link,
      template: '<div></div>',
      scope: {
        center: '@'
      }
    };


    function MapDirectiveController($scope, $element, MapFactory) {
      var vm = this;
    }

    function link(scope, element, attrs, controller) {
      var centerObj = JSON.parse(scope.center);
      MapFactory.createMap(element[0], centerObj).then(
        function(map) {
          scope.map = map;
        },
        function(rejectReason) {
          console.log("Can't create map, reason: " + rejectReason);
        }
      );
    }
  };
})();
