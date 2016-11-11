(function() {
  'use strict';
  angular.module('cityInfo.controllers').controller('MapController', ['$scope', 'MapFactory', 'PoiApi', MapController]);

  function MapController($scope, MapFactory, PoiApi) {
    var vm = this;
    vm.map = null;
    vm.poiApi = null;

    vm.latestLocation = null;

    vm.showUserPosition = true;
    vm.userPosMarker = null;

    //empty placeholder for searchbar
    vm.poiAutocompleteService = {
      getQueryPredictions: function(){ return []; },
      getPlacePredictions: function(){ return []; }
    };


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
          initPoiAutocomplete(vm.map);
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
      PoiApi.createPlaces(map).then(
        function(placesApi) {
          vm.poiApi = placesApi;
        },
        function(rejectReason) {}
      );
    };

    function initPoiAutocomplete(map) {
      PoiApi.createAutoCompleteService(map).then(
        function(autoCompleteService) {
          vm.poiAutocompleteService = autoCompleteService;
        },
        function(rejectReason) {}
      );
    };

    vm.centerToUser = function() {
      if (vm.map !== null && vm.latestLocation != null) {
        vm.map.setZoom(15);
        vm.map.panTo(vm.latestLocation);
      }
    };

    vm.showFavorites = function() {
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

      vm.latestLocation = latLng;
      updateUserPosMarker();
    });
    llb_app.request('location');
  };
})();
