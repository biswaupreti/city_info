(function() {
  'use strict';
  angular.module('cityInfo.map').controller('MapController', MapController);

  MapController.$inject = ['$scope', 'MapFactory', 'PoiApiFactory', 'PoiAutocompleteService'];

  function MapController($scope, MapFactory, PoiApiFactory, PoiAutocompleteService) {
    var vm = this;
    vm.map = null;
    vm.poiApi = null;

    vm.latestLocation = null;

    vm.showUserPosition = true;
    vm.userPosMarker = null;

    vm.centerToUser = centerToUser;
    vm.showFavorites = showFavorites;

    vm.getQueryPredictions = getPoiAutoCompleteResults;

    $scope.$watch('fullscreen', function(newVal, oldVal) {
      if (newVal == true && vm.map === null) {
        initMap();
      }
    });

    function initMap() {
      var mapCenter = vm.latestLocation !== null ? vm.latestLocation : {lat: 61.5, lng: 23 };

      //TODO create a directive for map that creates some div for map and use that instead
      var mapDiv = document.getElementById('gmap');

      MapFactory.createMap(mapDiv, mapCenter).then(
        function(map) {
          vm.map = map;

          initUserPositionMarker(vm.map, mapCenter);
          if (vm.showUserPosition) {
            showUserPosMarker();
          }

          initPoiApi(vm.map);
        },
        function(rejectReason){}
      );
    };

    function initUserPositionMarker(map, initPosition) {
      vm.userPosMarker = map.createMarker(initPosition, 'img/userpositionmarker.svg');
      vm.userPosMarker.setClickable(false);
    };

    function updateUserPosMarker() {
      if (vm.userPosMarker !== null) {
        vm.userPosMarker.setPosition(vm.latestLocation);
      }
    }

    function showUserPosMarker() {
      if (vm.map !== null && vm.userPosMarker !== null) {
          vm.map.showMarker(vm.userPosMarker);
      }
    };

    function initPoiApi(map) {
      PoiApiFactory.createApi(map).then(
        function(placesApi) {
          vm.poiApi = placesApi;
        },
        function(rejectReason) {}
      );
    };

    function centerToUser() {
      if (vm.map !== null && vm.latestLocation != null) {
        vm.map.setZoom(15);
        vm.map.panTo(vm.latestLocation);
      }
    };

    function showFavorites() {
      console.log('Favorites button pressed');
    };

    function getPoiAutoCompleteResults(queryText) {
      var queryObj = {
        input: queryText
      };

      if (vm.map !== null) {
        queryObj.bounds = vm.map.getBounds();
      }
      else if (vm.latestLocation !== null) {
        queryObj.location = vm.latestLocation;
        queryObj.radius = 500;
      }

      return PoiAutocompleteService.getQueryPredictions(queryObj);
    }

    llb_app.addListener('location', function(data){
      var latLng = {
        lat: data.data.latitude,
        lng: data.data.longitude
      };
      
      vm.latestLocation = latLng;
      updateUserPosMarker();
    });
    llb_app.request('location');
  };
})();
