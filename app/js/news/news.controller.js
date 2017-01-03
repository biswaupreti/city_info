(function() {
  'use strict';
  angular.module('cityInfo.news').controller('NewsController', NewsController);

  NewsController.$inject = ['$http'];

  function NewsController($http) {
    var vm = this;
    vm.news= [];

    $http.get('https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=4fd9c090e8c04c9f983076ed474461cd')
    .then(function(response) {
      var articles = response.data.articles;
      angular.forEach(articles, function (newsArticle) {
        vm.news.push(newsArticle)
      })
    }, function(rejectReason) {
      console.log("Error getting news " + rejectReason);
    });
  }
})();
