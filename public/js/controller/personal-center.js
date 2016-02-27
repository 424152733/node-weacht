define(['app', 'ajaxService'], function(app, ajaxService) {
    return app.controller('pcController', function($scope, ajaxService) {
        //登录
        $scope.login = function() {
            ajaxService.login('/user/login', {
                openid: $('#openid').val(),
                mobile_no: $scope.mobile_no,
                password: $scope.password
            }).success(function(data) {
                if(data.rescode === 0){
                    var url = window.location.href;
                    url.indexOf('?') == -1? window.location = url: window.location = url.substring(0,url.indexOf('?'));
                }
                if(data.rescode === 100001) {
                    $('#invalidNumber').modal('show');
                }
                if(data.rescode === 100002) {
                    $('#invalidCode').modal('show');
                }
                if(data.rescode === 100003) {
                    $('#loggedIn').modal('show');
                }
            }).error(function(data) {
                alert('服务器内部错误!')
            })
        };

        //登出
        $scope.logout = function() {
            ajaxService.logout('/user/logout').success(function(data){
                if(data.rescode == 0){
                    window.location = '/weixin/personalCenter';
                }
            }).error(function(){
                alert('服务器内部错误!')
            })
        };
    });
});