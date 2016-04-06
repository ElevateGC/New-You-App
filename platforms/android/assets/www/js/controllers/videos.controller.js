angular.module('controllers')

.controller("VideosCtrl", function(
	$scope,
	$state,
	$stateParams,
	$rootScope,
	youtubeFactory,
	$ionicLoading,
	$ionicModal) {

	$scope.videos = [];
  $scope.showPlayer = false;
  $ionicLoading.show();
  var youTubeApiKey = "AIzaSyCMEpsJej_aAhAQa3kGo_-m6q3OREGDOYM";

  youtubeFactory.getVideosFromChannelById({
    channelId: "UCEf9tCFR9u8eorfLdLlHh0A",
    // q: "<SEARCH_STRING>", // (optional) filters the channel result with your search string
    order: "date", // (optional) valid values: 'date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount' | default: 'date'
    // publishedAfter: "<PUBLISHED_AFTER>", // (optional) RFC 3339 formatted date-time value (1970-01-01T00:00:00Z)
    // publishedBefore: "<PUBLISHED_AFTER>", // (optional) RFC 3339 formatted date-time value (1970-01-01T00:00:00Z)
    // regionCode: "<REGION_CODE>", // (optional) ISO 3166-1 alpha-2 country code
    // relevanceLanguage: "<RELEVANCE_LANGUAGE>", // (optional) ISO 639-1 two-letter language code
    // safeSearch: "<SAFE_SEARCH>", // (optional) valid values: 'moderate','none','strict' | defaut: 'moderate'
    maxResults: "50", // (optional) valid values: 0-50 | default: 5
    // videoEmbeddable: "<VIDEO_EMBEDDABLE>", // (optional) valid values: 'true', 'any' | default: 'true'
    // videoLicense: "<VIDEO_LICENSE>", // (optional) valid values: 'any','creativeCommon','youtube'
    // videoSyndicated: "<VIDEO_SYNDICATED>", // (optional) restrict a search to only videos that can be played outside youtube.com. valid values: 'any','true' | default: 'any'
    // fields: "<FIELDS>", // (optional) Selector specifying which fields to include in a partial response
    //pageToken: "<PAGE_TOKEN>", // (optional)
    //part: "<PART>", // (optional) default: 'id,snippet'
    key: youTubeApiKey,
  }).then(function (resp) {
    //on success
    // console.log(resp.data);
    $ionicLoading.hide();
    angular.forEach(resp.data.items, function(item){
      var vid = {
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        date: item.snippet.publishedAt,
        id: item.id.videoId,
        height: item.snippet.thumbnails.high.height-80 * $rootScope.deviceWidth/ item.snippet.thumbnails.high.width + 'px'
      }
      $scope.videos.push(vid);
      // console.log(vid);
    })
  }).catch(function (resp) {
    //on error
    $ionicLoading.hide();
    console.log("error", resp);
  });

  $ionicModal.fromTemplateUrl('templates/video_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openVideo = function(id) {
    $scope.showPlayer = true;
    $scope.playerHeight =  window.innerHeight - 44 - 35 + "px";
    //docs: https://developers.google.com/youtube/v3/docs/videos/list
    youtubeFactory.getVideoById({
        videoId: id,
        // part: "<YOUR_PART>", // (optional) default: 'id,snippet,contentDetails,statistics'
        key: youTubeApiKey,
    }).then(function (response) {
      //on success
      // console.log(response);
      $scope.modal.show(); 
      $scope.video = response.data.items[0];
    }).catch(function (response) {
        //on error
    });
  }

  
  $scope.closeModal = function(id) {
    $scope.showPlayer = false;
    $scope.modal.hide();
  };
  
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})