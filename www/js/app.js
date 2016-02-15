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


angular.module('NewYou', ['ionic','ionic.service.core',
  'controllers',
  'services',
  'filters',
  'ngCordova',
  'angular-cache',
  'shared.directives',
  'ngLodash',
  'pascalprecht.translate'
])
.run(function($ionicPlatform, $translate, $log, $cordovaPush, $rootScope, $http, $ionicPlatform) {
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
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
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
      
      initPushwoosh();

    }, false);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider, $translateProvider) {

  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  $ionicConfigProvider.views.maxCache(0);

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
    controller: 'AppCtrl'
  })

  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
      }
    }
  })

  .state('app.categories', {
    url: "/categories",
    views: {
      'menuContent': {
        templateUrl: "templates/categories.html",
        controller: 'CategoriesCtrl'
      }
    }
  })

  .state('app.category', {
    url: "/categories/:categoryName",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: 'CategoryCtrl'
      }
    }
  })

  .state('app.posts', {
    url: "/posts",
    views: {
      'menuContent': {
        templateUrl: "templates/posts.html",
        controller: 'PostsCtrl'
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
    url: "/posts/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'PostCtrl'
      }
    }
  })

  .state('app.custom', {
    url: "/custom",
    views: {
      'menuContent': {
        templateUrl: "templates/custom.html"
      }
    }
  })

  .state('app.tabs', {
    url: "/tabs",
    views: {
      'menuContent': {
        templateUrl: "templates/tabs.html",
        controller: 'TabsCtrl'
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
