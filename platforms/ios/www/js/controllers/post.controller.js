angular.module('controllers')

.controller("PostCtrl", function(
  $rootScope,
	$scope,
	CacheFactory,
	$stateParams,
	$log,
	$sce,
	Category,
	$ionicLoading,
	$cordovaSocialSharing) {

	function loadPost(id) {
    return Category.get(id).then(function(resp){
      // console.log(resp)
      return resp;
    })
  }

  //this event will only happen once per view being created
  $scope.$on('$ionicView.loaded', function(){
  });

  //happens every time the view is loaded
  $scope.$on('$ionicView.beforeEnter', function() {

    $ionicLoading.show({
      noBackdrop: false,
      templateUrl: 'templates/directives/loader.html'
    });

    $rootScope.searchPage = false;

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if( !postCache.get( $stateParams.id ) ) {
      // Item is not in cache, go get it
      $ionicLoading.show({
        noBackdrop: true,
        templateUrl: 'templates/directives/loader-color.html'
      });
      loadPost($stateParams.id).then(function(resp) {
        $scope.post = resp;
        angular.forEach($scope.post.categories, function(cat) {
          if (cat != 1074 && Category.filters(cat) != null) {
            $rootScope.activeCategoryHeader = Category.filters(cat);
          }
        })
        $scope.content = $sce.trustAsHtml(resp.content.rendered);
        $ionicLoading.hide();
      });

    } else {
       $ionicLoading.hide();
      // Item exists, use cached item
      $scope.post = postCache.get( $stateParams.id );
      angular.forEach($scope.post.categories, function(cat) {
        if (cat != 1074 && Category.filters(cat) != null) {
          $rootScope.activeCategoryHeader = Category.filters(cat);
        }
      })
      $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
      // $scope.comments = $scope.post._embedded['replies'][0];
    }
  });

	$scope.shareViaFacebook = function(post) {
    $ionicLoading.show({
      noBackdrop: true,
      templateUrl: 'templates/directives/loader-color.html',
      duration: 500
    });
      $cordovaSocialSharing
      .shareViaFacebook(post.title.rendered, post.better_featured_image.source_url, post.link)
      .then(function(result) {
        // Success!
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();
         // alert('There was an error sharing to Facebook.');
        // An error occurred. Show a message to the user
      });
    }

    $scope.shareViaInstagram = function(post) {
      $ionicLoading.show({
        noBackdrop: true,
        templateUrl: 'templates/directives/loader-color.html',
        duration: 500
      });
      convertImgToDataURLviaCanvas(post.better_featured_image.source_url, function(base64Img){
          Instagram.share(base64Img, post.title.rendered, function (err) {
            if (err) {
                // console.log("not shared");
            } else {
                // console.log("shared");
            }
        });
      });
    }

    $scope.shareViaPinterest = function(post) {
      $cordovaSocialSharing
      .shareViaPinterest(post.title.rendered, post.better_featured_image.source_url, post.link)
      .then(function(result) {
        // Success!
        $ionicLoading.hide();
      }, function(err) {
        // An error occurred. Show a message to the user
      });
    }

    $scope.shareViaTwitter = function(post) {
      $ionicLoading.show({
        noBackdrop: true,
        templateUrl: 'templates/directives/loader-color.html',
        duration: 500
      });
      $cordovaSocialSharing
      .shareViaTwitter(post.title.rendered, post.better_featured_image.source_url, post.link)
      .then(function(result) {
        // Success!
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();
        // alert('There was an error sharing to Twitter.');
        // An error occurred. Show a message to the user
      });
    }
})