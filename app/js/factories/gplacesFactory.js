angular.module('cityInfo.factories').factory('PoiApi', [function() {
  var googlePlaces = function(attributionContainer) {
    if (attributionContainer.map !== undefined && attributionContainer.map instanceof google.maps.Map) {
      this.api = new google.maps.places.PlacesService(attributionContainer.map);
    }
    else {
      this.api = new google.maps.places.PlacesService(attributionContainer);
    }

    this.searchWithDetails = function(queryObj, callback) {
      this.api.nearbySearch(queryObj, callback);
    };

    this.search = function(queryObj, callback) {
      this.api.radarSearch(queryObj, callback);
    };

    this.getDetails = function(queryObj, callback) {
      if ((typeof queryObj) === 'string') {
        this.api.getDetails({ placeId: queryObj }, callback);
      }
      else {
        this.api.getDetails(queryObj, callback);
      }
    };
  }
  return (googlePlaces);
}]);
