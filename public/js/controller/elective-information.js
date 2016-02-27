
//requirejs 集成
define(['app','ajaxService'], function(app,ajaxService) {
    return app.controller('eiController', function($scope, ajaxService) {
        $scope.load = function(issue) {
            ajaxService.getMycourse('/weixin/getMyCourseList', {issue: issue})
                .success(function(results){
                    if(results.rescode == 0){
                        $scope.courses = results.courses;
                    }
                }).error(function(err){
                    console.log(err);
                })
        };

        $scope.$watch("$viewContentLoaded", function(){
            $scope.load(20152);
        })
    })

});