(function() {
  'use strict';
  angular.module('cityInfo.map').factory('MapFactory', GMapFactory);

  GMapFactory.$inject = ['LoadGoogleMapsApi', '$q'];

  function GMapFactory(LoadGoogleMapsApi, $q, mapDiv, center) {
    return {
      createMap: function(mapDiv, center) {
        return LoadGoogleMapsApi.then(
          function() {
            if (!(mapDiv instanceof Element)) {
              return $q.reject("MapDiv was not Element");
            }

            var mapOptions = {
              zoom: 14,
              center: center,
              mapTypeId: 'roadmap',
              disableDefaultUI: true
            };
            var map = new google.maps.Map(mapDiv, mapOptions);

            var mapObj = {
              setCenter: setCenter,
              panTo: panTo,
              setZoom: setZoom,
              fitBounds: fitBounds,
              getBounds: getBounds,
              createMarker: createMarker,
              showMarker: showMarker,
              removeMarker: removeMarker,
              getGoogleMap: getMap
            };
            return mapObj;

            function setCenter(center) {
              map.setCenter(center);
            };

            function panTo(center) {
              map.panTo(center);
            };

            function setZoom(zoom) {
              map.setZoom(zoom);
            };

            function fitBounds(bounds) {
              map.fitBounds(bounds);
            }

            function getBounds() {
              return map.getBounds();
            }

            function createMarker(properties) {
              var marker = new google.maps.Marker(properties);
              return marker;
            }

            function showMarker(marker) {
              marker.setMap(map);
            };

            function removeMarker(marker) {
              marker.setMap(null);
            };

            function getMap() {
              return map;
            }
          },
          function(rejectReason) {
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
