angular.module('controllers')


.controller('PostCtrl', function($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, Bookmark, $timeout, $cordovaSocialSharing ) {

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = $rootScope.url + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $log.debug($scope.post);
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  $scope.shareViaFacebook = function(post) {
    $cordovaSocialSharing
    .shareViaFacebook(post.title.rendered, post.better_featured_image.source_url, post.link)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.shareViaInstagram = function(post) {
    $cordovaSocialSharing
    .shareViaInstagram(post.title.rendered, post.better_featured_image.source_url, post.link)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.shareViaPinterest = function(post) {
    $cordovaSocialSharing
    .shareViaPinterest(post.title.rendered, post.better_featured_image.source_url, post.link)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.shareViaTwitter = function(post) {
    $cordovaSocialSharing
    .shareViaTwitter(post.title.rendered, post.better_featured_image.source_url, post.link)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

})

.controller('BookmarksCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  $scope.$on('$ionicView.enter', function(e) {

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if ( ! CacheFactory.get('bookmarkCache') ) {
      CacheFactory.createCache('bookmarkCache');
    }

    var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

    $scope.posts = [];
  
    angular.forEach( bookmarkCacheKeys, function( value, key ) {
      var newPost = postCache.get( value );
      $scope.posts.push( newPost );
    });

  });
    
})
