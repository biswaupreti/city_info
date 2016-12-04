(function() {
  'use strict';
  angular.module('cityInfo.news').controller('NewsController', function($http,$scope){
  	$scope.news= [{title:'1stnews'},{title:'2ndnews'}];
  	/*$http.get('https://external.api.yle.fi/v1/programs/items.json?q=muumit&limit=1&app_id=ba306bcd&app_key=76d513583d19451e054bcc9dab2f2e64')
		.success(function (response) {
			console.log(response)
        })
    */
  });

})();