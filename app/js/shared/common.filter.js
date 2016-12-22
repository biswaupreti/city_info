(function() {
  'use strict';
  function UnderscoreToSpaceFilterFactory() {
    return function (input) {
      if (typeof input === 'string') {
        return input.replace(/_/g, ' ');
      }
      else {
        return input;
      }
    };
  };

  function StrBlackListFilterFactory() {
    function checkContains(needle, haystack) {
      return haystack.indexOf(needle) > -1;
    }

    return function (input, blacklist) {
      if (typeof blacklist === 'string') {
        var blacklistStr = blacklist
        blacklist = [blacklistStr];
      }

      if (typeof input === 'string') {
        !checkContains(input, blacklist) ? input : null;
      }
      else if (input !== null && input !== undefined) {
        var passedCategories = [];
        for (var i = 0; i < input.length; ++i) {
          var category = input[i];
          if (!checkContains(category, blacklist)) {
            passedCategories.push(category);
          }
        }

        return passedCategories;
      }
      else {
        return null;
      }
    };
  }

  angular.module('cityInfo.shared')
    .filter('underscoreToSpace', UnderscoreToSpaceFilterFactory)
    .filter('strBlacklist', StrBlackListFilterFactory);
})();
