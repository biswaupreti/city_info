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
            mapTypeId: 'roadmap'
          };

          var mapObj = {};
          mapObj.map = new google.maps.Map(mapDiv, mapOptions);
          mapObj.options = mapOptions;

          mapObj.setCenter = function(center) {
            this.map.setCenter(center);
          };

          mapObj.showMarker = function(location) {
            var marker = new google.maps.Marker({
              map: this.map,
              position: location
            });

            return marker;
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
