angular.module('shared.directives', [])

.directive('ngBackground', function(){
  return function(scope, element, attrs){

    attrs.$observe("ngBackground",function(n,o){
       if(!n) return;
       element.css({
        'background-image': 'url(' + n + ')',
        'background-size' : 'cover',
        'background-repeat' : 'no-repeat',
        'background-position' : 'center center'
      });
      
    },true);
   
  };
})

.directive("compileHtml", function($parse, $sce, $compile) {
    return {
        restrict: "A",
        link: function (scope, element, attributes) {
 
            var expression = $sce.parseAsHtml(attributes.compileHtml);
 
            var getResult = function () {
                return expression(scope);
            };
 
            scope.$watch(getResult, function (newValue) {
                var linker = $compile(newValue);
                element.append(linker(scope));
            });
        }
    }
})

.directive('categoryFilter', ['$ionicScrollDelegate','$state','$rootScope', function ($ionicScrollDelegate,$state,$rootScope) {
  return {
    restrict: 'E',
    scope: {
      category: '=',
      activefilter: '=',
      posts: '@'
    },
    templateUrl: 'templates/directives/category-filter.html',
    controller: function($scope, $element, $attrs){

      switch ($scope.category) {
        //health
        case 1033:
          $scope.filters = 
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
          ];
          break;

          //wellness
        case 1034:
          $scope.filters = 
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
          break;

          //beauty
        case 1032:
          $scope.filters =[ 
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
          break;

          //fashion
        case 1269:
          $scope.filters = [
            {
              label: "show all",
              id: 1269
            }
          ]
          break;

          //celebrity
        case 1035:
          $scope.filters =[ 
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
          break;

          //entertainment
        case 1037:
        $scope.filters =[ 
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
          break;

        default:
          $scope.filters = null;
      } 
    
      $scope.filterPosts = function(filter){
        
      }

      $scope.setActiveFilter = function(filter) {
        $scope.activefilter = filter;
        $ionicScrollDelegate.$getByHandle('category-scroll').resize();
      }
    },
    link: function(scope, elem, attrs){
    }
  };
}]);
