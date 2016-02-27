/**
 * 路由地址定义说明
 * wxmenu: 微信公众号自定义菜单定义的url,统一用wxmenu开头
 * weixin: 微信授权后重定向url,统一用weixin开头
 * user: 在内嵌页面进行用户相关操作统一用user开头
 **/
var weixin = require('../controller/weixin');
var user = require('../controller/user');
var course = require('../controller/course');
var OAuth = require('wechat-oauth');
var config = require('config');

var app_id = config.get('wx.app_id');
var app_secret = config.get('wx.app_secret');
//微信授权
var oauth = new OAuth(app_id, app_secret);

module.exports = function(app) {
    app.use('/weixin', function(req, res ,next){
        var code = req.query.code;
        if(code && !req.session.openid) {
            oauth.getAccessToken(code, function (err, result) {
                if (err) return next(err);
                req.session.openid = result.data.openid;
                next();
            });
        }else{
            next();
        }
    });
    //微信菜单定义的路由以及重定向路由
    app.all('/wxmenu/:type', weixin.oAuth);
    app.get('/weixin/mycourse', weixin.judgeLogin, weixin.myCourse);
    app.get('/weixin/getMyCourseList', weixin.getMyCourseList);

    app.get('/weixin/selectCourse', weixin.judgeLogin, weixin.selectCourse);
    app.get('/weixin/getSelectCourseList', weixin.getSelectCourseList);

    app.get('/weixin/queryScore', weixin.judgeLogin, weixin.queryScore);
    app.get('/weixin/getScoreList', weixin.getScoreList);

    app.get('/weixin/unitManagement', weixin.judgeLogin, weixin.unitManagement);

    app.get('/weixin/personalCenter', weixin.judgeLogin, weixin.personalCenter);

    //用户登录登出
    app.post('/user/login', user.userLogin);
    app.get('/user/logout', user.userLogout);

    //课程
    app.get('/course/detail', course.getDetail);
    app.get('/course/studyOnline', course.getVideoDirectory);
};