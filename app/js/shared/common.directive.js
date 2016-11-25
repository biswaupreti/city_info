(function() {
  'use strict';
  angular.module('cityInfo.shared')
    .directive('ngEnter', function () {
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
    })
    .directive('mdCloseAutocompleteOnEnter', function () {
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
    });
})();
