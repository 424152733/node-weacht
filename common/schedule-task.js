var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
var scheduleTask = {};
//每秒都执行的任务
scheduleTask.secondTask = function() {
    var times = [];
    for(var i=1; i<60; i++){
        times.push(i);
    }
    rule.second = times;
    var c = 0;
    var job = schedule.scheduleJob(rule, function(){
        c++;
        console.log(c);
    });
};

//每小时的固定时间
scheduleTask.hourTask = function() {
    rule.minute = 40;
    var job = schedule.scheduleJob(rule, function(){
        console.log("执行任务");
    });
};

//一个星期中的某些天的某个时刻执行
scheduleTask.dayTask = function() {
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = 20;
    rule.minute = 0;
    var job = schedule.scheduleJob(rule, function(){
        console.log("执行任务");
    });
};

//固定时间执行
scheduleTask.timeTask = function() {
    var date = new Date(2014,2,14,15,40,0);
    var job = schedule.scheduleJob(date, function(){
        console.log("执行任务");
    });

    //取消任务
    job.cancel();
};
module.exports = scheduleTask;

