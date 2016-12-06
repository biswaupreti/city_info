(function() {
  'use strict';
  angular.module('cityInfo.shared')
    .filter('underscoreToSpace', function () {
      return function (input) {
        if (typeof input === 'string') {
          return input.replace(/_/g, ' ');
        }
        else {
          return input;
        }
      };
    })
})();
