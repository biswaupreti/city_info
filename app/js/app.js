
var pw = angular.module('cityInfo', ['ngMaterial'])
pw.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .dark();
});

pw.run(['$rootScope', function($rootScope){

	$rootScope.fullscreen = false;
	$rootScope.initialized = false;
  $rootScope.mapInitialized = false;

	llb_app.addListener('window_state', function(data){
		if(data.fullscreen)
		{
			$rootScope.$apply(function(){
				$rootScope.fullscreen = true;
        setMapSize($rootScope.window_dimensions.fullscreen_width, $rootScope.window_dimensions.fullscreen_height);

        if (!$rootScope.mapInitialized) {

          var myLatLng = new google.maps.LatLng(
            61.497054, 23.758784
          );

          if ($rootScope.latestLocation) {
            myLatLng = new google.maps.LatLng(
              $rootScope.latestLocation.latitude,
              $rootScope.latestLocation.longitude
            );
          }

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

          $rootScope.mapInitialized = true;
        }

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
			$rootScope.initialized = true;

      setMapSize(data.fullscreen_width, data.fullscreen_height);
		})
	})

  llb_app.request('location')
	llb_app.addListener('location', function(data){
		$rootScope.$apply(function(){
	     $rootScope.latestLocation = data;
		})
	})

  function setMapSize(windowWidth, windowHeight) {
    var mapDiv = document.getElementById('gmap');
    if (mapDiv != null) {
      mapDiv.style.width = windowWidth + "px";
      mapDiv.style.height = (windowHeight - 64) + "px"; //64px is height of the top thing with 'Living Lab Bus' text on it
    }
  }
}])

pw.controller('MainController', ['$rootScope', '$http', function($rootScope, $http){
	var vm = this
	vm.date = new Date()
	vm.loading = true;

	vm.getQuote = function(code)
	{
		switch(true)
		{
			case code == 800:
				return 'Vai niin, aurinkokin pääti tulla esille.'
			case [801, 802, 803, 804].indexOf(code) > 0:
				return 'Mitä mukava sää...'
			case [500, 501, 502, 503, 504 , 511, 520, 521, 522, 531].indexOf(code) > 0:
				return 'Aijaa. Taas sadetta.'
			default:
				return 'Vai niin, aurinkokin pääti tulla esille.'
		}
	}

	vm.getIcon = function(code)
	{
		switch(true)
		{
			case code == 800:
				return 'img/sunny.gif'
			case [801, 802, 803, 804].indexOf(code) > 0:
				return 'img/cloudy.png'
			case [500, 501, 502, 503, 504 , 511, 520, 521, 522, 531].indexOf(code) > 0:
				return 'img/rainy.gif'
			default:
				return 'img/sunny.gif'
		}

	}
}])
