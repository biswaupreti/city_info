(function() {
  'use strict';
  angular.module('cityInfo.map').directive('aptMap', MapDirective);

  MapDirective.$inject = ['MapFactory'];

  function MapDirective(MapFactory) {
    return {
      restrict: 'E',
      replace: false,
      controller: 'MapController',
      controllerAs: 'map',
      link: link
    };

    function link(scope, element, attrs, controller) {
      element[0].style.display = 'block'; //make custom directive visible

      var mapElem = angular.element('<div></div>');
      mapElem.css('width', '100%').css('height', '100%');
      element.prepend(mapElem);

      //create the map when app first goes fullscreen
      //maybe not the best solution for reusable directive?
      var unregisterWatcher = scope.$root.$watch('fullscreen', function(newVal, oldVal) {
        if (newVal === true && controller.map === null) {
          var center = controller.latestLocation;
          MapFactory.createMap(mapElem[0], center).then(
            function(map) {
              controller.setMap(map);
              unregisterWatcher();
            },
            function(rejectReason) {
              console.log("Can't create map, reason: " + rejectReason);
            }
          );
        }
      });
    }
  };
})();
