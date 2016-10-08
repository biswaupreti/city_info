angular.module('cityInfo.factories', []);
angular.module('cityInfo.controllers', ['cityInfo.factories']);

var pw = angular.module('cityInfo', ['ngMaterial', 'cityInfo.factories', 'cityInfo.controllers'])
pw.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .dark();
});

pw.run(['$rootScope', function($rootScope){

  $rootScope.fullscreen = false;
  $rootScope.initialized = false;

  llb_app.addListener('window_state', function(data){
    if(data.fullscreen)
    {
      $rootScope.$apply(function(){
        $rootScope.fullscreen = true;
      })
    }
    else
    {
      $rootScope.$apply(function(){
        $rootScope.fullscreen = false;
      })
    }
  });

  llb_app.request('window_dimensions');
  llb_app.addListener('window_dimensions', function(data){
    $rootScope.$apply(function(){
      $rootScope.window_dimensions = data
      $rootScope.fullscreen_app_dimensions = {
        "width": data.fullscreen_width + "px",
        "height": data.fullscreen_height - 64 + "px"
      };

      $rootScope.initialized = true;
    });
  });

  llb_app.request('location');
  llb_app.addListener('location', function(data){
    $rootScope.$apply(function(){
       $rootScope.latestLocation = data;
    })
  });
}]);
