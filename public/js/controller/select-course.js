angular.module('scCtrl', ['app.selectDire', 'ajaxService'])
    .controller('scController', function($scope, ajaxService) {
        $scope.load = function(address) {
            ajaxService.getMycourse('/weixin/getSelectCourseList', {address: address})
                .success(function(results){
                    if(results.rescode == 0){
                        $scope.courses = results.courses;
                    }
                }).error(function(err){
                    console.log(err);
                })
        };
        $scope.$watch("$viewContentLoaded", function(){
            $scope.load('远程');
        })
    });
