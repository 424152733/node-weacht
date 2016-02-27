//var page = angular.module('app.selectDire', []);
//
//page.directive('changeSelect', function() {
//    return {
//        restrict: 'AE',
//        link: function(scope, element, attributes) {
//            element.bind('change', function() {
//                var issue = $(this).val();
//                scope.load(issue);
//            })
//        }
//    }
//});

//requirejs集成
define(['app'], function(app) {
    app.directive('changeSelect', function() {
        return {
            restrict: 'AE',
            link: function(scope, element, attributes) {
                element.bind('change', function() {
                    var issue = $(this).val();
                    scope.load(issue);
                })
            }
        }
    })
});