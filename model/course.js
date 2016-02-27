
/**
 * module: Course
 * param: @id:课程编号 @data：课程详情
 **/

function Course (id, data) {
    this.id = id;
    this.data = data;
}

/**
 * 保存课程
 **/

Course.prototype.save = function (fn) {
    redis.hmset('course:' + this.id + ':data', this.data, function(err){
        if(err) fn(err);
        fn(null);
    });
};

/**
 * 查询课程详情
 **/

Course.find = function (id, fn) {
    redis.hgetall('course:' + id + ':data', function (err, obj) {
        if(err) return fn(err);
        fn(null, obj);
    })
};

module.exports = Course;

