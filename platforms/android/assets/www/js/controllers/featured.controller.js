angular.module("controllers")

.controller('FeaturedCtrl', function(
	$rootScope,
	$scope,
	Category,
	$ionicLoading,
	$timeout,
	$ionicScrollDelegate,
	$state,
  $ionicSlideBoxDelegate) {


  function fixScroll(handleName) {
    $timeout(function(){
        var sv = $ionicScrollDelegate.$getByHandle(handleName).getScrollView();
        var container = sv.__container;
        var originaltouchStart = sv.touchStart;
        var originalmouseDown = sv.mouseDown;
        var originaltouchMove = sv.touchMove;
        var originalmouseMove = sv.mouseMove;

        container.removeEventListener('touchstart', sv.touchStart);
        container.removeEventListener('mousedown', sv.mouseDown);
        document.removeEventListener('touchmove', sv.touchMove);
        document.removeEventListener('mousemove', sv.mousemove);
        

        sv.touchStart = function(e) {
          e.preventDefault = function(){}
          originaltouchStart.apply(sv, [e]);
        }

        sv.touchMove = function(e) {
          e.preventDefault = function(){}
          originaltouchMove.apply(sv, [e]);
        }
        
        sv.mouseDown = function(e) {
          e.preventDefault = function(){}
          originalmouseDown.apply(sv, [e]);
        }

        sv.mouseMove = function(e) {
          e.preventDefault = function(){}
          originalmouseMove.apply(sv, [e]);
        }

        container.addEventListener("touchstart", sv.touchStart, false);
        container.addEventListener("mousedown", sv.mouseDown, false);
        document.addEventListener("touchmove", sv.touchMove, false);
        document.addEventListener("mousemove", sv.mouseMove, false);
     })
  }

	function loadData() {
    $ionicLoading.show({
      noBackdrop: false,
      templateUrl: 'templates/directives/loader.html'
    });

    Category.recent().then(function(response) {
      $scope.recentPosts = [];
      var firstPost = response[0];
      console.log(response);
      $scope.postHeight = firstPost.better_featured_image.media_details.height * $rootScope.deviceWidth/ firstPost.better_featured_image.media_details.width + 'px'
      $ionicLoading.hide();
      angular.forEach(response, function(res) {
      	var post = res;
      	// console.log(res);
      	angular.forEach(res.categories, function(cat) {
      		if (cat != 1074 && Category.filters(cat) != null) {
      			post.category = Category.filters(cat);
      			$scope.recentPosts.push(post);
      	 	}
      	})
        $ionicSlideBoxDelegate.update();

      })
    })	
    $scope.categories = Category.loadAll();
    $ionicScrollDelegate.$getByHandle('featured-scroll').resize();
  }

  //this event will only happen once per view being created
  $scope.$on('$ionicView.loaded', function(){
    loadData();
  });

  //happens every time the view is loaded
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.activeCategory = Category.filters(1074);
    $rootScope.activeCategoryHeader = $scope.activeCategory;
    $rootScope.searchPage = false;
  });

  //this event will trigger when the view has finished leaving and is no longer the active view.
  $scope.$on('$ionicView.afterLeave', function(){
    console.log('view has left')
  });

  $scope.goToPost = function(post) {
    angular.forEach(post.categories, function(cat) {
      if (cat != 1074 && Category.filters(cat) != null) {
        $rootScope.activeCategoryHeader = Category.filters(cat);
        $state.go('app.post', {id: post.id});
        return;
      }
    })
  }

  $scope.doRefresh = function() {
    $timeout( function() {
     loadData();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };

  $scope.onDrag = function(event) {
    event.preventDefault();
    $ionicScrollDelegate.$getByHandle('featured-scroll').freezeScroll(true);
  }
})