angular.module('shared.directives', [])

.directive('ngBackground', function(){
  return function(scope, element, attrs){

    attrs.$observe("ngBackground",function(n,o){
       if(!n) return;
       element.css({
        'background-image': 'url(' + n + ')',
        'background-size' : attrs.size,
        'background-repeat' : 'no-repeat',
        'background-position' : 'center center'
      });
      
    },true);
   
  };
})

.directive('getAuthor', ['$http', '$rootScope', '$log', function($http, $rootScope, $log) {
return {
    restrict: 'E',    
    scope:{
        id:"="
    },
    controller:function($scope, $element){

      $http({method: 'GET', url: $rootScope.url + 'users/' + $scope.id + '?fields=name,link,date'}).then(function (result) {
        $scope.author = result.data;
        $element.innerHTML = result.data.name;
        $log.debug($scope.author);                    
      }, function (result) {
        $log.debug('Error with grabbing author data');
      });
    }
  }
}])

.directive('categoryFilter', ['$ionicScrollDelegate','$state','$rootScope', function ($ionicScrollDelegate,$state,$rootScope) {
  return {
    restrict: 'E',
    scope: {
      category: '=',
      filterPosts: '&',
      setActiveFilter: '&'
    },
    templateUrl: '../templates/directives/category-filter.html',
    controller: function($scope, $element, $attrs){

      $scope.activeFilter = "show all";

      switch ($scope.category) {
        case "health":
          $scope.filters = ["show all", "mens", "sex", "tips", "tips from pros", "videos"];
          break;

        case "wellness":
          $scope.filters = ["show all", "fitness", "nutrition", "relationships", "tips from pros", "weight loss"];
          break;

        case "beauty":
          $scope.filters = ["show all", "body", "face", "hair", "makeup", "nails", "skincare", "style", "tips from the pros", "videos"];
          break;

        case "fashion":
          $scope.filters = ["show all"];
          break;

        case "celebrity":
          $scope.filters = ["show all", "photos", "up close", "videos"];
          break;

        case "entertainment":
          $scope.filters = ["show all", "celebrity", "interviews", "movie trailers", "movies", "music", "red carpet", "tv", "videos"];
          break;

        default:
          $scope.filters = null;
      } 
    
      $scope.filterPosts = function(filter){
        
      }

      $scope.setActiveFilter = function(filter) {
        $scope.activeFilter = null;
        $scope.activeFilter = filter;
      }
    },
    link: function(scope, elem, attrs){
    }
  };
}]);