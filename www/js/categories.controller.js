angular.module('controllers')

.controller('CategoriesCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $ionicLoading, $rootScope, $log, lodash ) {

  var mainCategories = [
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

  var recentPostsApi = $rootScope.url + 'posts';

  var category_id_count = 0;

  var filterParams = '&fields=id,title,better_featured_image';

  $scope.moreRecentPosts = false;
  $scope.moreCategories = false;

  $scope.loadRecentPosts = function() {

    $ionicLoading.show({
      noBackdrop: false,
      templateUrl: 'templates/directives/loader.html'
    });

    // Get all of our posts
    DataLoader.get( recentPostsApi + '?fields=id,title,better_featured_image' ).then(function(response) {

      $scope.recentPosts = response.data;

      $scope.moreRecentPosts = true;

      $log.log(recentPostsApi, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  };

  $scope.loadCategories = function() {

    $ionicLoading.show({
      noBackdrop: false,
      templateUrl: 'templates/directives/loader.html'
    });

    $scope.categories = [];

    $scope.category_pages = [];

    angular.forEach(mainCategories, function(data){

      var recentPosts = $rootScope.url + 'posts?filter[category_name]=' + data.label + filterParams;

      var category = {};
      category.title = data.label;
      category.id = category_id_count++;

      $scope.category_pages[data] = 2;

      DataLoader.get( recentPosts).then(function(response) {
        category.posts = response.data;
        $scope.categories.push(category);
        $log.log($scope.categories);

        $log.debug('this is response for single category', category);

        $ionicLoading.hide();
      }, function(response) {
        $log.error('error', response);
        $ionicLoading.hide();
      });

      $log.log($scope.category_pages);
    })

    $scope.moreCategories = true;
  };

  // Load 10 most recent posts
  $scope.loadRecentPosts();
  // Load categories on page load
  $scope.loadCategories();

  //get recent posts for each category

  // Load more (infinite scroll)
  $scope.loadMore = function(category) {

    if( !$scope.moreItems ) {
      return;
    }

    $scope.category_pages[category] = $scope.category_pages[category]++;

    $log.log('loadMore ' + $scope.category_pages[category] );

    var loadMoreCategoryPostsUrl = $rootScope.url + 'posts?filter[category_id]=' + category.id + filterParams;

    $timeout(function() {

      DataLoader.get( loadMoreCategoryPostsUrl + '?page=' + $scope.category_pages[category] ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          var category = lodash.findIndex($scope.categories, {title: category});
          $scope.categories[category] = value;
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

      $scope.loadCategories();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
})
