angular.module('cityInfo.services').factory('MapService', function($http){
  var serviceInstance = {
  };

  serviceInstance.createMap = function(mapDiv, center) {
    var mapOptions = {
      zoom: 14,
      center: center,
      mapTypeId: 'roadmap'
    };
    var map = new google.maps.Map(mapDiv, mapOptions);

    return new function() {
      this.map = map;
      this.options = mapOptions;

      this.setCenter = function(center) {
        this.map.setCenter(center);
      };

      this.showMarker = function(location) {
        var marker = new google.maps.Marker({
          map: this.map,
          position: location
        });

        return marker;
      };

      this.removeMarker = function(marker) {
        marker.setMap(null);
      };
    };
  };

  return serviceInstance;
});
