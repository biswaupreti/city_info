(function() {
  'use strict';
  angular.module('cityInfo.map').controller('MapController', MapController);

  MapController.$inject = ['$scope'];

  function MapController($scope) {
    var vm = this;
    vm.map = null;

    vm.latestLocation = { lat: 61.498180, lng: 23.762195 };

    vm.showUserPosition = true;
    vm.userPosMarker = null;

    vm.setMap = setMap;
    vm.getMap = getMap;
    vm.centerToUser = centerToUser;

    function setMap(map) {
      vm.map = map;
      initUserPositionMarker(vm.map, vm.latestLocation);

      $scope.$emit('mapReady', vm.map);
    }

    function getMap() {
      return vm.map;
    }

    function initUserPositionMarker(map, initPosition) {
      vm.userPosMarker = map.createMarker(initPosition, 'img/userpositionmarker.svg');
      vm.userPosMarker.setClickable(false);

      if (vm.showUserPosition) {
        showUserPosMarker();
      }
    }

    function updateUserPosMarker() {
      if (vm.userPosMarker !== null) {
        vm.userPosMarker.setPosition(vm.latestLocation);
      }
    }

    function showUserPosMarker() {
      if (vm.map !== null && vm.latestLocation != null) {
        if (vm.userPosMarker === null) {
          initUserPositionMarker(vm.map, vm.latestLocation);
        }

        vm.map.showMarker(vm.userPosMarker);
      }
    }

    function centerToUser() {
      if (vm.map !== null && vm.latestLocation != null) {
        vm.map.setZoom(15);
        vm.map.panTo(vm.latestLocation);
      }
    }

    llb_app.addListener('location', function(data){
      var latLng = {
        lat: data.data.latitude,
        lng: data.data.longitude
      };
      
      vm.latestLocation = latLng;

      if (vm.showUserPosition) {
        showUserPosMarker();
      }

      updateUserPosMarker();
    });
    llb_app.request('location');
  }
})();
