define(['app', 'ajaxService'], function(app, ajaxService) {
        return app.controller('qScheduleController', function($scope) {
            $scope.result = {};
            $scope.result.ifNull = false;
            $scope.$watch('$viewContentLoaded', function(){
                $('.dataPicker').datetimepicker({
                    minView: "month",
                    format: 'yyyy-mm-dd',
                    language: 'zh-CN',
                    autoclose: true
                });
            })
        })
    }
);