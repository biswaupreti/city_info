angular.module('cityInfo.controllers').controller('MapController', ['$scope', '$http', 'MapService', function($scope, $http, mapService){
  $scope.mapInitialized = false;
  $scope.map = null;

  $scope.$watch('fullscreen', function(newVal, oldVal) {
    if (newVal == true && !$scope.mapInitialized) {
      var myLatLng = {
        lat: 61.497054,
        lng: 23.758784
      };

      var mapDiv = document.getElementById('gmap');
      $scope.map = mapService.createMap(mapDiv, myLatLng);
      $scope.mapInitialized = true;

      
      var placesService = new google.maps.places.PlacesService($scope.map.map);
      placesService.nearbySearch({
        location: myLatLng,
        radius: 500,
        type: ['cafe']
      }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            place = results[i];
            var placeLoc = place.geometry.location;
            $scope.map.showMarker(placeLoc);
          }
        }
      });

    }
  });
}]);
