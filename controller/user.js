
var User = require('../model/user');

//用户登录
exports.userLogin = function (req, res, next) {
    var openid = req.body.openid;
    var mobile_no = req.body.mobile_no;
    var pwd = req.body.password;
    var userObj = {};
    connection.execute("select * from T_SYS_USER where mobile_no ='"+mobile_no+"'", [], function(err, results) {
        if(err) return next(err);
        if(results && results != '') {
            if(results[0].PASSWORD != pwd){
                //验证码错误
                res.json({rescode: 100002});
            }else{
                //if(results[0].WX_OPENID != null){
                //    //用户已登录
                //    res.json({rescode: 100003});
                //}else{
                    connection.execute("update T_SYS_USER set WX_OPENID='"+openid+"' where mobile_no='"+mobile_no+"'", [], function(err, results) {
                        if(err) return next(err);
                        connection.execute("select * from T_SYS_USER where mobile_no='"+mobile_no+"'", [], function(err, results) {
                            if(err) return next(err);
                            req.session.user = results[0];
                            userObj = new User(results[0].WX_OPENID ,results[0]);
                            userObj.save(function(err) {
                                if(err) return next(err);
                                res.json({rescode: 0, msg:'success'});
                            });
                        })
                    });
                }
            //}
        }
        else{
            //手机号不存在
            res.json({rescode: 100001});
        }
    })
};

//用户登出
exports.userLogout = function (req, res, next) {
    var user = req.session.user;
    User.delete(req.session.openid, function(err, reply) {
       if(err) return next(err);
        if(reply) {
            connection.execute("update T_SYS_USER set WX_OPENID='' where mobile_no='"+user.MOBILE_NO+"'", [], function(err, results) {
                if(err) return next(err);
                if(results){
                    delete req.session.user;
                    res.json({rescode: 0 , msg: 'success'});
                }
            });
        }else {
            res.json({rescode: 100004})
        }
    });

};

