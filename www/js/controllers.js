angular.module('controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader, $rootScope, $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  $rootScope.url = 'http://newyou.elevatehost.xyz/wp-json/wp/v2/';

  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

  // $rootScope.mainCategories = ["beauty", "health", "wellness", "fashion", "celebrity", "entertainment"];

  $rootScope.mainCategories = [
    {
      label: "featured",
      id: 1074
    },
    {
      label: "beauty",
      id: 1032
    },
    {
      label: "health",
      id: 1033
    },
    {
      label: "wellness",
      id: 1034
    },
    {
      label: "fashion",
      id: 1269
    },
    {
      label: "celebrity",
      id: 1035
    },
    {
      label: "entertainment",
      id: 1037
    }
  ];

  $rootScope.activeCategory = $rootScope.mainCategories[0];
})


.controller('PostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ) {

  var postsApi = $rootScope.url + 'posts';

  $scope.moreItems = false;

  $ionicLoading.show({
    noBackdrop: false,
    templateUrl: 'templates/directives/loader.html'
  });

  $scope.loadPosts = function() {

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);
      $ionicLoading.hide();

    }, function(response) {
      $log.log(postsApi, response.data);
      $ionicLoading.hide();
    });

  }

  // Load posts on page load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
    
})
