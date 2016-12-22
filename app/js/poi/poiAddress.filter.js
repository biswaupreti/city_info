(function() {
  'use strict';
  angular.module('cityInfo.poi')
    .filter('poiAddress', PoiAddressFilterFactory);

    function PoiAddressFilterFactory() {
      return function (input, shortVersion) {
        if (input === null) {
          return null;
        }

        if (input.address_components !== undefined) {
          if (shortVersion) {
            var streetNumber = null;
            var route = null;
            var locality = null;

            for (var i = 0; i < input.address_components.length; ++i) {
              var component = input.address_components[i];
              if (component.types) {
                for (var j = 0; j < component.types.length; ++j) {
                  var type = component.types[j];
                  if (type === "route") {
                    route = component.long_name;
                  }
                  else if (type === "street_number") {
                    streetNumber = component.long_name;
                  }
                  else if (type === "locality" ||
                  (locality == null && type == "political") ||
                  (locality == null && type == "administrative_area_level_3")) {
                    locality = component.long_name;
                  }
                }
              }
            }

            if (route === null) {
              return input.formatted_address;
            }

            var address = route;

            if (streetNumber !== null) {
              address += " " + streetNumber;
            }

            return locality !== null ? (address + ", " + locality) : address;
          }
          else {
            return input.formatted_address;
          }
        }
        else if (input.formatted_address !== undefined) {
          return input.formatted_address;
        }
        else {
          return null;
        }
      };
    }
})();
