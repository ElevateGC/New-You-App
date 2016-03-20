function initPushwoosh() {
  var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
  if (device.platform == "Android") {
    registerPushwooshAndroid();
  }

  if (device.platform == "iPhone" || device.platform == "iOS") {
    registerPushwooshIOS();
  }

  if (device.platform == "Win32NT") {
    registerPushwooshWP();
  }

  pushNotification.getLaunchNotification(
    function(notification) {
      if (notification != null) {
        alert(JSON.stringify(notification));
      } else {
        console.log("No launch notification");
      }
    }
  );
}
function convertImgToDataURLviaCanvas(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}

var wordpress_url = 'http://newyou.elevatehost.xyz/wp-json/wp/v2/posts?filter[cat]=';
var url_params = '&fields=id,title,better_featured_image,categories';
var wordpress_categories = 
  [
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

angular.module('NewYou', [
  'ionic',
  'ionic.service.core',
  'controllers',
  'services',
  'filters',
  'ngCordova',
  'angular-cache',
  'shared.directives',
  'ngLodash',
  'pascalprecht.translate',
  'ngSanitize',
  'angularMoment',
  'jett.ionic.filter.bar',
  '720kb.socialshare',
  'ion-floating-menu',
  'youtube-embed',
  'jtt_youtube'
])
.run(function($ionicPlatform, $translate, $log, $cordovaPush, $rootScope, $http, amMoment, $window) {
  
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  $rootScope.deviceWidth = window.innerWidth;
  $rootScope.deviceHeight = window.innerHeight;

  var androidConfig, iosConfig, register;
 
    androidConfig = {
        "senderID": ""
    };
    iosConfig = {
        "badge": true,
        "sound": true,
        "alert": true
    };
 
    register = function(os, token) {
        var baseUrl;
        baseUrl = 'http://newyou.elevatehost.xyz/pnfw';
        if (!baseUrl) {
            return $q.reject();
        }
        return $http({
            method: 'POST',
            url: baseUrl + '/register',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var p, str;
                str = [];
                for (p in obj) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
                return str.join('&');
            },
            data: {
                os: os,
                token: token
            }
        });
    };
    return $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if ($window.cordova && $window.cordova.plugins.Keyboard) {
        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        $window.cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleColor('white');
      }
      if (typeof navigator.globalization !== 'undefined') {
        $cordovaGlobalization.getPreferredLanguage().then(function (language) {
          $translate.use((language.value).split('-')[0]).then(function (data) {
            console.log('SUCCESS -> ' + data);
          }, function (error) {
            console.log('ERROR -> ' + error);
          });
        }, null);
      }

      amMoment.changeLocale('en-gb');
      
      initPushwoosh();

    }, false);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider, $translateProvider, $httpProvider) {

  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  // $ionicConfigProvider.views.maxCache(0);

  angular.extend(CacheFactoryProvider.defaults, { 
    'storageMode': 'localStorage',
    'capacity': 10,
    'maxAge': 10800000,
    'deleteOnExpire': 'aggressive',
    'recycleFreq': 10000
  })

  // Native scrolling
  if( ionic.Platform.isAndroid() ) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }

  $translateProvider.translations('en', {
    appTitle: 'Pinbook',
    categoriesTitle: 'Categories',
    placesTitle: 'Places',
    reviewsTitle: 'Reviews',
    profileTitle: 'Profile',
    newPlaceTitle: 'New place',
    mapTitle: 'Map',
    nearmeText: 'Near me',
    addNewPlaceText: 'Add a place',
    profileText: 'Profile',
    settingsText: 'Settings',
    logoutText: 'Log Out',
  });

  $stateProvider

  // sets up our default state, all views are loaded through here
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: function($rootScope, $scope) {
      $scope.clickSearchIcon = function() {
        $rootScope.$emit('showFilterBar');
      }
      $rootScope.searchPage = false;
      $rootScope.mainCategories = wordpress_categories;
    }
  })


  .state('app.categories', {
    url: "/categories",
    views: {
      'menuContent': {
        templateUrl: "templates/categories.html",
        controller: function($rootScope, $scope, Category, $ionicLoading, $timeout, $ionicScrollDelegate, $state) {

          function loadData() {
            $ionicLoading.show({
              noBackdrop: false,
              templateUrl: 'templates/directives/loader.html'
            });
            Category.recent().then(function(response) {
              $scope.recentPosts = response;
              var firstPost = response[0];
              $scope.postHeight = firstPost.better_featured_image.media_details.height * $rootScope.deviceWidth/ firstPost.better_featured_image.media_details.width + 'px'
              $ionicLoading.hide();
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

        }
      }
    }
  })

  .state('app.category', {
    url: "/categories/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: function($rootScope, $scope, $stateParams, Category, lodash, $ionicLoading, $timeout, $ionicFilterBar, $log, $ionicScrollDelegate) {

          //push all category filters that are loaded when viewing page in this array
          $scope.filters = [];
          //we do this so that we can keep track of the paging associated with each filter category id

          //create empty array to add ids of the categories which have no more data to load
          $scope.hasNoPosts = [];

          var category = {};
          function loadCategory(categoryId, page) {


            //hide search filter if visible
            if (filterBarInstance) {
              filterBarInstance();
              filterBarInstance = null;
            }

            var url = wordpress_url + categoryId + '&page=' + page + url_params;
            return Category.all_posts(url).then(function(resp){
              console.log(resp)
              return resp;
            })
          }


          $scope.moreItems = false;

          //this event will only happen once per view being created
          $scope.$on('$ionicView.loaded', function(){

            $ionicLoading.show({
              noBackdrop: false,
              templateUrl: 'templates/directives/loader.html'
            });
            $scope.activeCategory = Category.filters($stateParams.id);
            $scope.activefilter = $scope.activeCategory.id;
            $rootScope.activeCategoryHeader = $scope.activeCategory;
          })


          $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.searchPage = true;
            $rootScope.activeCategoryHeader = $scope.activeCategory;
            $scope.activeCategory = Category.filters($stateParams.id);
          })

          //on first load grab posts for active category
          loadCategory($stateParams.id, 1).then(function(resp) {

            $scope.posts = resp;
            var firstPost = resp[0];
            $scope.postHeight = firstPost.better_featured_image.media_details.height * $rootScope.deviceWidth/ firstPost.better_featured_image.media_details.width + 'px'
              

            angular.forEach($scope.activeCategory.filters, function(filter, index) {
              filter.page = 1;
              $scope.filters.push(filter);
            });
            $ionicLoading.hide();
          });
          console.log('active category', $scope.activeCategory);
          console.log('active filter', $scope.activefilter);

          $scope.$watch(function () {
            $scope.filteredItems = $scope.$eval("posts | filter:{'categories': activefilter} | unique:'id' | filter: searchFilter");
          });

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

          $scope.moreDataExists = function() {
            return $scope.moreItems;
          }


          var filterBarInstance;

          $rootScope.$on('showFilterBar', function (event, args) {
            filterBarInstance = $ionicFilterBar.show({
              items: $scope.posts,
              update: function (filteredposts, filterText) {
                $scope.posts = filteredposts;
                $ionicScrollDelegate.$getByHandle('category-scroll').resize();
                if (filterText) {
                  console.log(filterText);
                }
              }
            });
          });
        }
      }
    }
  })


  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "templates/bookmarks.html",
        controller: 'BookmarksCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/posts/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: function($rootScope, $scope, CacheFactory, $stateParams, $log, $sce, Category, $ionicLoading, $cordovaSocialSharing) {

          function loadPost(id) {
            return Category.get(id).then(function(resp){
              console.log(resp)
              return resp;
            })
          }

          //this event will only happen once per view being created
          $scope.$on('$ionicView.loaded', function(){
          });

          //happens every time the view is loaded
          $scope.$on('$ionicView.enter', function() {

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
                      console.log("not shared");
                  } else {
                      console.log("shared");
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
        }
      }
    }
  })

  .state('app.videos', {
      url: "/videos",
      views: {
        'menuContent': {
          templateUrl: "templates/videos.html",
          controller: function($scope, $state, $stateParams, $rootScope, youtubeFactory, $ionicLoading, $ionicModal) {
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
              console.log(resp.data);
              $ionicLoading.hide();
              angular.forEach(resp.data.items, function(item){
                var vid = {
                  title: item.snippet.title,
                  thumbnail: item.snippet.thumbnails.high.url,
                  date: item.snippet.publishedAt,
                  id: item.id.videoId,
                  height: item.snippet.thumbnails.high.height * $rootScope.deviceWidth/ item.snippet.thumbnails.high.width + 'px'
                }
                $scope.videos.push(vid);
                console.log(vid);
              })
            }).catch(function (resp) {
              //on error
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
              $scope.playerHeight =  window.innerHeight - 44 + "px";
              //docs: https://developers.google.com/youtube/v3/docs/videos/list
              youtubeFactory.getVideoById({
                  videoId: id,
                  // part: "<YOUR_PART>", // (optional) default: 'id,snippet,contentDetails,statistics'
                  key: youTubeApiKey,
              }).then(function (response) {
                //on success
                console.log(response);
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
          }
        }
      }
    })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/categories');
});
