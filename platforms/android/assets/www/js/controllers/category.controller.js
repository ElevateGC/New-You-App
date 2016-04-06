angular.module('controllers')

.controller('CategoryCtrl', function(
  $rootScope,
  $scope,
  $stateParams,
  Category,
  lodash,
  $ionicLoading,
  $timeout,
  $ionicFilterBar,
  $log,
  $ionicScrollDelegate ) {

   //push all category filters that are loaded when viewing page in this array
    $scope.filters = [];
    //we do this so that we can keep track of the paging associated with each filter category id

    //create empty array to add ids of the categories which have no more data to load
    $scope.hasNoPosts = [];

    var category = {};

    $scope.canLoad = true;

    function loadCategory(categoryId, page) {
      //hide search filter if visible
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      var url = wordpress_url + categoryId + '&page=' + page + url_params;
      return Category.all_posts(url).then(function(resp){
        return resp;
      })
    }

    //this event will only happen once per view being created
    $scope.$on('$ionicView.loaded', function(){

      $ionicLoading.show({
        noBackdrop: false,
        templateUrl: 'templates/directives/loader.html'
      });
      $scope.activeCategory = Category.filters($stateParams.id);
      $scope.activefilter = $scope.activeCategory.id;
      $rootScope.activeCategoryHeader = $scope.activeCategory;

      loadCategory($stateParams.id, 1).then(function(resp) {
        $scope.posts = resp;
        var firstPost = resp[0];
        $scope.postHeight = firstPost.better_featured_image.media_details.height * $rootScope.deviceWidth/ firstPost.better_featured_image.media_details.width + 'px';
        $ionicLoading.hide();
        angular.forEach($scope.activeCategory.filters, function(filter, index) {
          filter.page = 1;
          $scope.filters.push(filter);
        });
      })
    })


    $scope.$on('$ionicView.beforeEnter', function() {

      $rootScope.searchPage = true;
      $rootScope.activeCategoryHeader = $scope.activeCategory;
      $scope.activeCategory = Category.filters($stateParams.id);
      
    })

    $scope.$watch(function () {
      $scope.filteredItems = $scope.$eval("posts | filter:{'categories': activefilter} | unique:'id' | filter: searchFilter");
    });

    $scope.loadMore = function(params) {
      $timeout(function() {

        //look at array of filters for current category
        //find active filter object in that array by looking up the active filterId
        //increment page number by 1 and load posts associated with that filterId
        //create new posts array by merging posts array with response array
        //if response is empty add filterId to the hasNoPosts array
        //so you can compare activeFilterId with items in hasNoPosts
        console.log('$scope.filteredItems', $scope.filteredItems);

        if (params == 'refresh' && $scope.hasNoPosts.indexOf($scope.activefilter) == -1) {
          loadCategory($scope.activefilter, 1).then(function(resp) {
            var newPosts = lodash.uniq($scope.posts.concat(resp), 'id');
            $scope.posts = newPosts;
            if (resp.length === 0) {
              $scope.hasNoPosts.push(item.id);
            }
            $ionicScrollDelegate.$getByHandle('category-scroll').resize();
            $scope.$broadcast('scroll.refreshComplete');
          })
        } else if (params == 'infinite') {
          angular.forEach($scope.filters, function(item, index) {
            if (item.id == $scope.activefilter) {
              item.page++
              // console.log($scope.filters)
              loadCategory(item.id, item.page).then(function(resp) {
                var newPosts = lodash.uniq($scope.posts.concat(resp));
                $scope.posts = newPosts;
                console.log("posts", $scope.posts);
                if (resp.length === 0) {
                  $scope.hasNoPosts.push(item.id);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicScrollDelegate.$getByHandle('category-scroll').resize();
              })
            }
          })
        } else {
          $ionicScrollDelegate.$getByHandle('category-scroll').resize();
          $scope.$broadcast('scroll.refreshComplete');
        }
      }, 0)
    }




  $scope.setActiveFilter = function(filterId) {
    $scope.activefilter = filterId;
    console.log('set new active filterId', $scope.activefilter);
    $timeout(function() {
      if ($scope.filteredItems.length  === 0 && $scope.hasNoPosts.indexOf(filterId) == -1) {
        $ionicLoading.show({
          noBackdrop: false,
          templateUrl: 'templates/directives/loader.html'
        });

        //look at array of filters for current category
        //find active filter object in that array by looking up the active filterId
        //increment page number by 1 and load posts associated with that filterId
        //create new posts array by merging posts array with response array
        //if response is empty add filterId to the hasNoPosts array
        //so you can compare activeFilterId with items in hasNoPosts
        lodash.find($scope.filters, function(item, index) {
          if (item.id == filterId) {
            item.page++
            console.log($scope.filters)
            loadCategory(item.id, item.page).then(function(resp) {
              var newPosts = lodash.uniq($scope.posts.concat(resp));
              $scope.posts = newPosts;
              if (resp.length === 0) {
                $scope.hasNoPosts.push(item.id);
              }
              $ionicLoading.hide();
            })
          }
        })
      }
    }, 100)
    $ionicScrollDelegate.$getByHandle('category-scroll').resize();
  }

    // end of set active filter function

    var filterBarInstance;

    $rootScope.$on('showFilterBar', function (event, args) {
      $scope.canLoad = false;
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.posts,
        update: function (filteredposts, filterText) {
          $scope.posts = filteredposts;
          $ionicScrollDelegate.$getByHandle('category-scroll').resize();
        },
        cancel: function() {
          $scope.canLoad = true;
        },
        function(filterText, value) {
          return value.title.rendered == filterText
        }
      });
    });

})
