define(['app', 'ajaxService'], function(app, ajaxService) {
    return app.controller('csController', function($scope, ajaxService) {
        $scope.turnOut = function() {
            $scope.isOutManager = true;
        };
        $scope.turnIn = function() {
            $scope.isInManager = true;
        }
    })
});