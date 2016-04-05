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
  'jtt_youtube',
  'dibari.angular-ellipsis'
])
.run(function($ionicPlatform, $translate, $log, $cordovaPush, $rootScope, $http, amMoment, $window, $ionicConfig) {
  
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
      $ionicConfig.scrolling.jsScrolling(false)
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
    controller: function($rootScope, $scope, $ionicHistory, $state) {
      $scope.clickSearchIcon = function() {
        $rootScope.$emit('showFilterBar');
      }
      $rootScope.searchPage = false;
      $rootScope.mainCategories = wordpress_categories;
      $scope.goToFeatured = function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            historyRoot: true
        });
        $state.go('app.categories');
      }

      $scope.openBrowser = function(link) {
        window.open(link, "_blank");
      }
    }
  })


  .state('app.categories', {
    url: "/categories",
    views: {
      'menuContent': {
        templateUrl: "templates/categories.html",
        controller: "FeaturedCtrl"
      }
    }
  })

  .state('app.category', {
    url: "/categories/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: "CategoryCtrl"
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
        controller: "PostCtrl"
      }
    }
  })

  .state('app.videos', {
    url: "/videos",
    views: {
      'menuContent': {
        templateUrl: "templates/videos.html",
        controller: "VideosCtrl"
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
