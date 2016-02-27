
define(['app'], function(app) {
    return app.service('ajaxService', function($http) {

        //成绩查询
        this.getGrades = function(url, data) {
            return $http({
                    method: 'GET',
                    params: data,
                    url: url
                }
            )
        };

        //课程详情
        this.getMycourse = function(url, data) {
            return $http({
                method: 'GET',
                params: data,
                url: url
            })
        };

        //获取openid
        this.getOpenId = function(url) {
            return $http({
                method: 'GET',
                url: url
            })
        };

        //用户登录
        this.login = function(url, data) {
            return $http({
                method: 'POST',
                data: data,
                url: url
            })
        };

        //用户登出
        this.logout= function(url) {
            return $http({
                method: 'GET',
                url: url
            })
        }
    })
});