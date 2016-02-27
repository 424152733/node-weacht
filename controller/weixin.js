
var API = require('wechat-api');
var OAuth = require('wechat-oauth');
var wechat = require('wechat');
var config = require('config');
var Date = require('../common/date-format').Date;

var menu_config = config.get('wx.wx_menu');
var app_id = config.get('wx.app_id');
var app_secret = config.get('wx.app_secret');
var domain = config.get('domain');

var User = require('../model/user');
var Course = require('../model/course');
//获取token_access
var api = new API(app_id, app_secret);

//微信授权
var oauth = new OAuth(app_id, app_secret);


/**
 *消息处理
 **/
exports.handleMessage = function() {
    return {
        message: wechat('shendatoken', wechat.text(function (message, req, res, next) {
            res.reply(message.Content);
            next();
        }).image(function (message, req, res, next) {
            res.reply({content: '图片路径：' + message.PicUrl, type: 'text'});
            next();
        }).voice(function (message, req, res, next) {
            res.reply('音频');
            next();
        }).video(function (message, req, res, next) {
            res.reply('视频');
            next();
        }).location(function (message, req, res, next) {
            res.reply('位置');
            next();
        }).event(function (message, req, res, next) {
            res.reply('事件');
            next();
        }))
    }
};

//创建自定义菜单
exports.creatM = function() {
    api.createMenu(menu_config, function (err, result) {
        console.log(result);
    });
};


//OAuth认证
exports.oAuth = function(req, res) {
    var param = req.params.type;
    var url = oauth.getAuthorizeURL('http://' + domain + '/weixin/' + param, '', 'snsapi_userinfo');
    if(req.session.openid){
        return res.redirect('/weixin/'+param);
    }
    return res.redirect(url);
};
//统一登录处理
exports.judgeLogin = function(req, res, next) {
    if(req.session.user) {
       next();
    }else{
        User.find(req.session.openid, function(err, user) {
            if(user && user != null){
                next();
            }else{
                res.render('personal-center', {
                    title: '个人中心',
                    openid: req.session.openid,
                    user: user
                });
            }
        });
    }
};
//选课信息(视图渲染)
exports.myCourse = function(req, res) {
    res.render('elective-information', {
        title:'课程信息'
    })
};

//选课信息(数据接口)
exports.getMyCourseList = function (req, res, next) {
    var sql = '';
    var courseList = [];
    var courseObj = {};
    var issue = req.query.issue;
    User.find(req.session.openid, function(err, user){
        if( user && user != null) {
            User.getCourses(user.SID, issue, function(err, courses) {
                if(err) return next(err);
                if(courses && courses.length != 0){
                    for(var i=0; i<courses.length; i++){
                        Course.find(courses[i], function(err, course) {
                            if(course && course != null){
                                course.CLASS_START_TIME = new  Date(course.CLASS_START_TIME).Format('yyyy-MM-dd');
                                course.CLASS_END_TIME = new  Date(course.CLASS_START_TIME).Format('yyyy-MM-dd');
                                course.EXAM_START_TIME = new  Date(course.CLASS_START_TIME).Format('yyyy-MM-dd');
                                course.EXAM_START_TIME = new  Date(course.CLASS_START_TIME).Format('yyyy-MM-dd');
                                courseList.push(course);
                            }
                            if(courseList.length === courses.length){
                                res.json({
                                    rescode: 0,
                                    courses: courseList
                                });
                            }
                        })
                    }
                }else{
                    sql += "select semeCourse.remark,semeCourse.sid,basecourse.discription,baseCourse.Ext_Course_Url,baseCourse.Course_Name, sci.code_name as delivery_mode_name,sci.code as     delivery_Mode, semeCourse.Course_No, semeCourse.Has_Exam,baseCourse.course_Type,baseCourse.course_Source,";
                    sql += "semeCourse.Class_Start_Time, semeCourse.Class_End_Time, semeCourse.Exam_Start_Time,semeCourse.Exam_End_Time,";
                    sql += "classRoom.Class_Name as class_Room_Name,choiceCourse.Is_Relearn is_Archive from t_teach_choice_course choiceCourse\r\n";
                    sql += "left join t_teach_seme_course semeCourse on semeCourse.Sid = choiceCourse.Seme_Cour_Id\r\n";
                    sql += "left join t_teach_base_course baseCourse on baseCourse.Sid = semeCourse.Course_Id\r\n";
                    sql += "left join t_sys_code_info sci on semeCourse.delivery_mode = sci.code\r\n";
                    sql += "left join t_sys_code_type sct on sci.code_type_id = sct.sid\r\n";
                    sql += "left join t_teach_class_room classRoom on classRoom.Sid = semeCourse.Class_Room_Id\r\n";
                    sql += "left join t_teach_plan_info planInfo on planInfo.Sid = semeCourse.Plan_Id\r\n";
                    sql += "where choiceCourse.status in('2', '3') and sct.type_code = 'JBKC_XXFS' and  choiceCourse.User_Id = (select sid from t_sys_user where WX_OPENID='"+req.session.openid+"')and planInfo.plan_issue = '"+issue+"' order by semeCourse.Class_Start_Time asc";
                    connection.execute(sql, [], function(err, results) {
                        if(err) return next(err);
                        if(results.length != 0){
                            for(var i = 0; i<results.length; i++) {
                                results[i].CLASS_START_TIME = new  Date(results[i].CLASS_START_TIME).Format('yyyy-MM-dd');
                                results[i].CLASS_END_TIME = new  Date(results[i].CLASS_START_TIME).Format('yyyy-MM-dd');
                                results[i].EXAM_START_TIME = new  Date(results[i].CLASS_START_TIME).Format('yyyy-MM-dd');
                                results[i].EXAM_START_TIME = new  Date(results[i].CLASS_START_TIME).Format('yyyy-MM-dd');
                                User.setCourses(user.SID, issue, results[i].SID, function(err, result) {
                                    if(err) return next(err);
                                });
                                courseObj = new Course(results[i].SID ,results[i]);
                                courseObj.save(function(err){
                                    if(err) return next(err);
                                    console.log('course create success');
                                });
                                courseList.push(results[i]);
                                if(courseList.length === results.length){
                                    res.json({
                                        rescode: 0,
                                        courses: courseList
                                    });
                                }
                            }
                        }else{
                            res.json({
                                rescode: 0,
                                courses: courseList
                            });
                        }

                    })
                }
            })
        }
    });
};

//我要选课(视图渲染)
exports.selectCourse = function(req, res) {
    res.render('select-course', {
        title: '我要选课'
    })
};

//我要选课(数据接口)
exports.getSelectCourseList = function(req, res) {

};

// 成绩查询(视图渲染)
exports.queryScore = function(req, res) {
    res.render('query-score', {
        title:'成绩查询'
    })
};

// 成绩查询(数据接口)
exports.getScoreList = function(req, res, next) {
    var issue = req.query.issue;
    User.find(req.session.openid, function(err, user){
        if(!user && !req.session.user) {
            res.render('personal-center', {
                title: '个人中心',
                openid: req.session.openid
            });
        }else{
            var sql = "";
            sql += "SELECT fiPayment.status\r\n";
            sql += "fi_status,userPrjOrgRel.Student_Number,RESULT.SID,PLAN.PLAN_ISSUE\r\n";
            sql += "PLAN_YEAR_TERM,BASE.COURSE_NAME,\r\n";
            sql += "SEME.HAS_EXAM,SEME.COURSE_NO,SEME.SID\r\n";
            sql += "seme_Cour_Id,SEME.DELIVERY_MODE,SEME.CLASS_HOUR\r\n";
            sql += "BASE_CLASS_HOUR,RESULT.CLASS_HOUR,\r\n";
            sql += "RESULT.EXAM_RESULT,RESULT.TOTAL_RESULT,BASE.CREDIT\r\n";
            sql += "BASE_CREDIT,RESULT.CREDIT\r\n";
            sql += "FROM T_TEACH_RESULT RESULT\r\n";
            sql += "inner JOIN T_TEACH_SEME_COURSE SEME ON  result.seme_cour_id = seme.sid\r\n";
            sql += "inner JOIN T_TEACH_BASE_COURSE BASE ON  BASE.SID = SEME.COURSE_ID\r\n";
            sql += "inner JOIN T_TEACH_PLAN_INFO PLAN ON PLAN.SID = SEME.PLAN_ID\r\n";
            sql += "inner JOIN T_TEACH_TRAIN_PROJECT PRJ ON PRJ.SID = PLAN.PROJECT_ID\r\n";
            sql += "inner join t_sys_user_prj_org_rel userPrjOrgRel on userPrjOrgRel.User_Id = result.user_id\r\n";
            sql += "inner join t_teach_prj_org_rel prjOrgRel on prjOrgrel.Sid = userPrjOrgRel.Prj_Org_Rel_Id and prjOrgrel.PROJECT_ID =  PRJ.SID\r\n";
            sql += "left join t_fi_payment_record fiPayment on fiPayment.student_id = RESULT.User_Id and RESULT.Seme_Cour_Id = fiPayment.course_seme_id\r\n";
            sql += "WHERE 1=1 and (userPrjOrgRel.PLAN_ID =  SEME.PLAN_ID or userPrjOrgRel.PLAN_ID is null) AND SEME.IS_ARCHIVE='1' AND PRJ.SID='67b7631ad92a4eefbbac459ab49c01ed' and seme.result_publish_status ='YFB' and result.user_id ='"+req.session.user.SID+"' and  PLAN.PLAN_ISSUE='"+issue+"'";
            connection.execute(sql, [], function(err, results) {
                if(err) return next(err);
                res.json( {
                    rescode : 0,
                    grades: results
                })
            });
        }
    });
};

//个人中心
exports.personalCenter = function(req, res) {
    res.render('personal-center', {
        title: '个人中心',
        openid: req.session.openid,
        user: req.session.user
    });
};

//单位管理
exports.unitManagement = function(req, res) {
    return res.redirect('/#/unitManagement');
};

