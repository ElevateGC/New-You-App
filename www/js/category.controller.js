angular.module('controllers')

.controller('CategoryCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $ionicLoading, $rootScope, $log, lodash, $stateParams ) {

  $scope.moreItems = false;
  
  $rootScope.activeCategory = $stateParams.categoryName;
  var categoryIndex = lodash.findIndex($rootScope.mainCategories, {label: $stateParams.categoryName});

  $scope.activefilter = $rootScope.mainCategories[categoryIndex].id;

  var filterParams = '&fields=id,title,better_featured_image,categories';

  paged = 1;

  var postsApi = $rootScope.url + 'posts?page='+ paged + '&filter[category_name]=' + $rootScope.activeCategory + filterParams;

  $ionicLoading.show({
    noBackdrop: false,
    templateUrl: 'templates/directives/loader.html'
  });

  $scope.loadPosts = function() {

    $scope.posts = [];

    return DataLoader.get( postsApi ).then(function(response) {

      return response.data;

    }).then(function(data){

      console.log(data);

      $scope.posts = data;

      $scope.moreItems = true;
      $ionicLoading.hide();

    }, function(error){
      $log.log(error);
      $ionicLoading.hide();

    });

    return $scope.posts;

  }

  // Load posts on page load
  $scope.loadPosts();

  // Load more (infinite scroll)
$scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var nextPage = paged++;

    $log.log('loadMore ' + nextPage );

    var loadNextPage = $rootScope.url + 'posts?page='+ nextPage + '&filter[category_name]=' + $rootScope.activeCategory + filterParams;

    $timeout(function() {

      DataLoader.get( loadNextPage ).then(function(response) {

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
