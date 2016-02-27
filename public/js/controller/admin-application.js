define(['app'], function(app) {
    app.controller('aaController', function($scope, $http) {
        $http.get('/data/data1.json').success(function(data){
            $scope.nameList = data
        }).error(function(){
            alert('服务器内部错误!')
        })
    })
});