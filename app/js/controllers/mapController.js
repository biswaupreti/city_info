angular.module('cityInfo.controllers').controller('MapController', ['$scope', 'Map', 'PoiApi', function($scope, Map, PoiApi){
  $scope.mapInitialized = false;
  $scope.map = null;
  $scope.poiApi = null;

  $scope.latestLocation = null;

  $scope.poiAutocompleteService = {
    getQueryPredictions: function(){ return []; },
    getPlacePredictions: function(){ return []; }
  };

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
                      var marker = $scope.map.createMarker(placeLoc);
                      $scope.map.showMarker(marker);
                    }
                  }
                }
              );
            },
            function(rejectReason) {}
          );

          PoiApi.createAutoCompleteService().then(
            function(autoCompleteService) {
              $scope.poiAutocompleteService = autoCompleteService;
              $scope.poiAutocompleteService.bindToMapArea(map);
            },
            function(rejectReason) {}
          );
        },
        function(rejectReason){}
      );
    }
  });

  $scope.centerToUser = function() {
    if ($scope.map != null && $scope.latestLocation != null) {
      $scope.map.setZoom(15);
      $scope.map.panTo($scope.latestLocation);
    }
  };

  $scope.showFavorites = function() {
    console.log('Favorites button pressed');
  };

  var userPosMarker = null;
  llb_app.request('location');
  llb_app.addListener('location', function(data){
    var latLng = {
      lat: data.latitude,
      lng: data.longitude
    };

    $scope.latestLocation = latLng;
    if ($scope.map !== null) {
      if (userPosMarker === null) {
        userPosMarker = $scope.map.createMarker(latLng, 'img/userPositionMarker.png');
        userPosMarker.setClickable(false);
        $scope.map.showMarker(userPosMarker);
      }

      userPosMarker.setPosition(latLng);
    }
  });
}]);
