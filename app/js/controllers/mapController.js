(function() {
  angular.module('cityInfo.controllers').controller('MapController', ['$scope', 'MapFactory', 'PoiApi', function($scope, MapFactory, PoiApi){
    $scope.map = null;
    $scope.poiApi = null;
    $scope.latestLocation = null;
    $scope.showUserPosition = true;

    //empty placeholder for searchbar
    $scope.poiAutocompleteService = {
      getQueryPredictions: function(){ return []; },
      getPlacePredictions: function(){ return []; }
    };

    var userPosMarker = null;

    $scope.$watch('fullscreen', function(newVal, oldVal) {
      if (newVal == true && $scope.map === null) {
        initMap();
      }
    });

    var initMap = function() {
      var mapCenter = $scope.latestLocation !== null ? $scope.latestLocation : {lat: 61.5, lng: 23 };

      //TODO create a directive for map that creates some div for map and use that instead
      var mapDiv = document.getElementById('gmap');

      MapFactory.createMap(mapDiv, mapCenter).then(
        function(map) {
          $scope.map = map;

          initUserPositionMarker($scope.map, mapCenter);
          if ($scope.showUserPosition) {
            showUserPosMarker();
          }

          initPoiApi($scope.map);
          initPoiAutocomplete($scope.map);
        },
        function(rejectReason){}
      );
    };

    var initUserPositionMarker = function(map, initPosition) {
      userPosMarker = map.createMarker(initPosition, 'img/userpositionmarker.svg');
      userPosMarker.setClickable(false);
    };

    var updateUserPosMarker = function() {
      if (userPosMarker !== null) {
        userPosMarker.setPosition($scope.latestLocation);
      }
    }

    var showUserPosMarker = function() {
      if ($scope.map !== null && userPosMarker !== null) {
          $scope.map.showMarker(userPosMarker);
      }
    };

    var initPoiApi = function(map) {
      PoiApi.createPlaces(map).then(
        function(placesApi) {
          $scope.poiApi = placesApi;
        },
        function(rejectReason) {}
      );
    };

    var initPoiAutocomplete = function(map) {
      PoiApi.createAutoCompleteService(map).then(
        function(autoCompleteService) {
          $scope.poiAutocompleteService = autoCompleteService;
        },
        function(rejectReason) {}
      );
    };

    $scope.centerToUser = function() {
      if ($scope.map !== null && $scope.latestLocation != null) {
        $scope.map.setZoom(15);
        $scope.map.panTo($scope.latestLocation);
      }
    };

    $scope.showFavorites = function() {
      console.log('Favorites button pressed');
    };

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

      $scope.latestLocation = latLng;
      updateUserPosMarker();
    });
    llb_app.request('location');
  }]);
})();
