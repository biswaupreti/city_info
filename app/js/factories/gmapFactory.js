angular.module('cityInfo.factories').factory('Map', ['LoadGoogleMapsApi', '$q', function(LoadGoogleMapsApi, $q, mapDiv, center){
  return {
    createMap: function(mapDiv, center) {
      return LoadGoogleMapsApi.then(
        function(){
          if (!(mapDiv instanceof Element)) {
            return $q.reject("MapDiv was not Element");
          }

          var mapOptions = {
            zoom: 14,
            center: center,
            mapTypeId: 'roadmap',
            disableDefaultUI: true
          };

          var mapObj = {};
          mapObj.map = new google.maps.Map(mapDiv, mapOptions);
          mapObj.options = mapOptions;

          mapObj.setCenter = function(center) {
            this.map.setCenter(center);
          };

          mapObj.panTo = function(center) {
            this.map.panTo(center);
          };

          mapObj.setZoom = function(zoom) {
            this.map.setZoom(zoom);
          };

          mapObj.fitBounds = function(bounds) {
            this.map.fitBounds(bounds);
          }

          mapObj.getBounds = function() {
            return this.map.getBounds();
          }

          mapObj.createMarker = function(location, icon) {
            var marker = new google.maps.Marker({
              position: location
            });

            if (icon != null) {
              marker.setIcon(icon);
            }

            return marker;
          }

          mapObj.showMarker = function(marker) {
            marker.setMap(this.map);
          };

          mapObj.removeMarker = function(marker) {
            marker.setMap(null);
          };

          return (mapObj);
        },
        function(rejectReason){
          return $q.reject(rejectReason);
        }
      );
    }
  };
}]);
