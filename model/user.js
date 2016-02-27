/**
 * module: User
 * param: @id:用户编号 @data：用户信息
 **/
function User (id, data) {
    this.id = id;
    this.data = data;
}

/**
 * 保存用户
 **/
User.prototype.save = function (fn) {
    redis.hmset('user:' + this.id + ':data', this.data, function(err){
        if(err)  fn(err);
        fn(null);
    })
};

/**
 * 获取用户
 **/
User.find = function (openid, fn) {
    redis.hgetall('user:' + openid + ':data', function(err, obj) {
        if(err) return fn(err);
        fn(null, obj);
    })
};

/**
 * 删除用户信息
 **/
User.delete = function (openid, fn) {
    redis.del('user:' + openid + ':data', function(err, obj) {
        if(err) return fn(err);
        fn(null, obj)
    })
};

/**
 * 获取用户的课程列表
 **/
User.getCourses = function (SID, issue, fn) {
    redis.smembers('user:' + SID + issue + ':course', fn);
};

/**
 * 保存用户的课程列表
 **/
User.setCourses = function(SID, issue, courseId, fn) {
    redis.sadd('user:' + SID + issue + ':course', courseId, fn);

};

module.exports = User;

