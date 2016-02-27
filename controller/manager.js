//新生考核
exports.newAssessment = function(req, res) {
    res.render('new-assessment', {
        title: '新生考核'
    });
};

//照片审核
exports.photoAudit = function(req, res) {
    res.render('photo-audit', {
        title: '照片审核'
    });
};

//选课管理
exports.courseManagement = function(req, res) {
    res.render('course-management', {
        title: '选课管理'
    });
};

//课表查询
exports.querySchedule = function(req, res) {
    res.render('query-schedule', {
        title: '课表查询'
    });
};

//转校管理
exports.changeSchool = function(req, res) {
    res.render('change-school', {
        title: '转校管理'
    });
};

//管理员申请/转让
exports.adminApplication = function(req, res) {
    res.render('admin-application', {
        title: '管理员申请/转让'
    });
};