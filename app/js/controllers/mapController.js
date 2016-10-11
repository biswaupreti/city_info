angular.module('cityInfo.controllers').controller('MapController', ['$scope', 'Map', 'PoiApi', function($scope, Map, PoiApi){
  $scope.mapInitialized = false;
  $scope.map = null;
  $scope.poiApi = null;

  $scope.$watch('fullscreen', function(newVal, oldVal) {
    if (newVal == true && !$scope.mapInitialized) {
      var myLatLng = {
        lat: 61.497054,
        lng: 23.758784
      };

      var mapDiv = document.getElementById('gmap');
      Map.createMap(mapDiv, myLatLng).then(
        function(map){
          $scope.map = map;
          $scope.mapInitialized = true;

          PoiApi.createPlaces($scope.map).then(
            function(placesApi) {
              $scope.poiApi = placesApi;
              $scope.poiApi.searchWithDetails({
                location: myLatLng,
                radius: 500,
                types: ['cafe']
              },
                function(results, status) {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                      place = results[i];
                      var placeLoc = place.geometry.location;
                      $scope.map.showMarker(placeLoc);
                    }
                  }
                }
              );
            },
            function(rejectReason) {}
          );
        },
        function(rejectReason){}
      );
    }
  });
}]);
