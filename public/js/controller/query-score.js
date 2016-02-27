
//requirejs 集成
define(['app','ajaxService'], function(app,ajaxService) {
    return app.controller('qsController', function($scope, ajaxService) {
        $scope.load = function(issue) {
            ajaxService.getGrades('/weixin/getScoreList', {issue: issue})
                .success(function(results){
                    if(results.rescode == 0){
                        $scope.grades = results.grades;
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