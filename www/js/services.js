angular.module('services', [])

/**
 * A simple example service that returns some data.
 */
.factory('DataLoader', function( $http, $log ) {

  return {
    get: function(url) {
      // Simple index lookup
      return $http.get( url );
    }
  }
})


.factory('Category', function(DataLoader, $log, $ionicLoading, $q, $http, lodash, CacheFactory, $sce) {
  var category = {};

  category.recent = function() {
    var url = 'http://newyou.elevatehost.xyz/wp-json/wp/v2/posts/?fields=id,title,better_featured_image,categories';
    return DataLoader.get( url ).then(function(response) {
      console.log('recent', response.data);
      return response.data;
    }, function(response) {
      console.log('error', response);
      return response;
    });
  }

  category.get = function(id) {
    var url = 'http://newyou.elevatehost.xyz/wp-json/wp/v2/posts/' + id + '?fields=id,title,link,author,content,better_featured_image,date,categories';
    
    return DataLoader.get( url ).then(function(response) {
      console.log(response);

      var authorApi = wordpress_url + 'users/' + response.data.author;

      return DataLoader.get( authorApi ).then(function( authorResponse) {

        var post = {};
        var postCache = CacheFactory.get( 'postCache' );

        post = response.data;
        post.author = authorResponse.data;

        // add post to our cache
        postCache.put( post.id, post );

        return post;

      }, function(response) {

          return response;
      });
    }, function(response) {

        return response;
    });
  }

  category.all_posts = function(url) {
    var category_item = {};
    return DataLoader.get(url).then(function(response) {
      return response.data;

    }, function(response) {
      $log.error('error', response);
      return response;
    });
  }

  category.loadAll = function() {
    var categories = [];
    angular.forEach(wordpress_categories, function(category_item){

      var category = {};
      category.label = category_item.label;
      category.id = category_item.id;
      var deferred = $q.defer();

      return $http.get(wordpress_url + category.id + '&page=1').then(function (response) { 
        deferred.resolve(response);
        return deferred.promise;
      }).then(function(resp){
        category.posts = resp.data;
        categories.push(category);
        //console.log(categories);
      })
    });
    return categories;
  }

  category.filters = function(category_id) {
    console.log(category_id);
        //health
        if (category_id == 1033){
          var filters =  
          [ 
            {
              label: "show all",
              id: 1033
            }, 
            {
              label: "mens",
              id: 1049
            },
            {
              label: "sex",
              id: 1048
            },
            {
              label: "tips",
              id: 1047
            },
            {
              label: "tips from pros",
              id: 1051
            },
            {
              label: "videos",
              id: 1050
            }
          ]

          var category = {
            id: 1033,
            label: 'health',
            filters: filters,
            color: "#1DAFEC"
          }
          console.log('category', category);
          return category;
        }
          //wellness
        if (category_id == 1034){
          var filters =  
          [ 
            {
              label: "show all",
              id: 1034
            }, 
            {
              label: "fitness",
              id: 1052
            },
            {
              label: "nutrition",
              id: 1053
            },
            {
              label: "relationships",
              id: 1054
            },
            {
              label: "tips from pros",
              id: 1068
            },
            {
              label: "weight loss",
              id: 1055
            },
            {
              label: "videos",
              id: 1056
            }
          ]

          var category = {
            id: 1034,
            label: 'wellness',
            filters: filters,
            color: "#ACCD73"
          }
          console.log('category', category);

          return category;
        }

          //beauty
        if (category_id == 1032){
          var filters = [ 
            {
              label: "show all",
              id: 1032
            }, 
            {
              label: "body",
              id: 1045
            },
            {
              label: "face",
              id: 1044
            },
            {
              label: "hair",
              id: 1040
            },
            {
              label: "makeup",
              id: 1041
            },
            {
              label: "nails",
              id: 1042
            },
            {
              label: "skincare",
              id: 1043
            },
            {
              label: "style",
              id: 1038
            },
            {
              label: "tips from the pros",
              id: 1039
            },
            {
              label: "videos",
              id: 1046
            }
          ]

          var category = {
            id: 1032,
            label: 'beauty',
            filters: filters,
            color: "#ED2B8B"
          }
          console.log('category', category);

          return category;
        }
          //fashion
        if (category_id == 1269){
          var filters =  [
            {
              label: "show all",
              id: 1269
            }
          ]

          var category = {
            id: 1269,
            label: 'fashion',
            filters: filters,
            color: "#F69831"
          }
          console.log('category', category);
          return category;
        }
          //celebrity
        if (category_id == 1035){
          var filters = [ 
            {
              label: "show all",
              id: 1035
            }, 
            {
              label: "photos",
              id: 1057
            },
            {
              label: "up close",
              id: 1058
            },
            {
              label: "videos",
              id: 1059
            }
          ]

          var category = {
            id: 1035,
            label: 'celebrity',
            filters: filters,
            color: "#7B3B93"

          }
          console.log('category', category);
          return category;
        }
          //entertainment
        if (category_id == 1037){
          var filters = [ 
            {
              label: "show all",
              id: 1037
            }, 
            {
              label: "celebrity",
              id: 1061
            },
            {
              label: "interviews",
              id: 1062
            },
            {
              label: "movie trailers",
              id: 1063
            },
            {
              label: "movies",
              id: 1060
            },
            {
              label: "music",
              id: 1065
            },
            {
              label: "red carpet",
              id: 1066
            },
            {
              label: "tv",
              id: 1064
            },
            {
              label: "videos",
              id: 1067
            }
          ]

          var category = {
            id: 1037,
            label: "entertainment",
            filters: filters,
            color: "#F0373B"
          }
          console.log('category', category);

          return category;
        }
        
        //featured
        if (category_id == 1074) {
          var category = {
            id: 1074,
            label: 'featured',
            filters: null,
            color: "#000"
          }
          console.log('category', category);
          return category;

        }

        else {
          return null;
        }
  }

  return category;

})

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
    },
    get: function(id) {
      bookmarkCache.get( id );
      console.log( id );
    },
    check: function(id) {
      var keys = bookmarkCache.keys();
      var index = keys.indexOf(id);
      if(index >= 0) {
        return true;
      } else {
        return false;
      }
    },
    remove: function(id) {
      bookmarkCache.remove(id);
    }
  }

})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
