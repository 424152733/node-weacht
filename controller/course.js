var Course = require('../model/course');

exports.getDetail = function(req, res, next) {
    var id = req.query.id;
    var sc = req.query.sc;
    Course.find(id, function(err, course) {
        res.render('course-detail', {
            title: '课程详情',
            course: course,
            sc: sc
        })
    });
};

exports.getVideoDirectory = function(req, res, next) {
    res.render('video-directory', {
        title: '在线学习'
    })
};
