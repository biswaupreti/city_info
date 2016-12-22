(function() {
  'use strict';

  function NgEnterDirective() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
            element.blur();
          });

          event.preventDefault();
        }
      });
    };
  }

  function mdCloseAutocompleteOnEnterDirective() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$$childHead.$mdAutocompleteCtrl.hidden = true; // $scope  modified to scope
          });

          event.preventDefault();
        }
      });
    };
  }

  angular.module('cityInfo.shared')
    .directive('ngEnter', NgEnterDirective)
    .directive('mdCloseAutocompleteOnEnter', mdCloseAutocompleteOnEnterDirective);
})();
