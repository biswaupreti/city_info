
var pw = angular.module('cityInfo', ['ngMaterial'])
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
				$rootScope.fullscreen = false
			})
		}
	})

	llb_app.request('window_dimensions')
	llb_app.addListener('window_dimensions', function(data){
		$rootScope.$apply(function(){
      $rootScope.window_dimensions = data
      $rootScope.fullscreen_app_dimensions = {
        "width": data.fullscreen_width + "px",
        "height": data.fullscreen_height - 64 + "px"
      };

			$rootScope.initialized = true;
		});
	})

  llb_app.request('location')
	llb_app.addListener('location', function(data){
		$rootScope.$apply(function(){
	     $rootScope.latestLocation = data;
		})
	})
}])

pw.controller('MainController', function($scope, $http){
  $scope.mapInitialized = false;
  $scope.$watch('fullscreen', function(newVal, oldVal) {
    if (newVal == true && !$scope.mapInitialized) {
      var myLatLng = new google.maps.LatLng(
        61.497054, 23.758784
      );

      var mapOptions = {
        zoom: 14,
        center: myLatLng,
        mapTypeId: 'roadmap'
      };
      var mapDiv = document.getElementById('gmap');
      var map = new google.maps.Map(mapDiv, mapOptions);

      var placesService = new google.maps.places.PlacesService(map);
      placesService.nearbySearch({
        location: myLatLng,
        radius: 500,
        type: ['cafe']
      }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            place = results[i];
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location
            });
          }
        }
      });

      $scope.mapInitialized = true;
    }
  });
});
