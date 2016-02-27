
var express = require('express');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var oracle = require('oracle');
var config = require('config');
var weixin = require('./controller/weixin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//app.engine('html',require('ejs').__express);
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = './common/layout.html';

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.query());
app.use(cookieParser('weixin'));
app.use(session({
  store: new redisStore({
    "host": "localhost",
    "port": "6379",
    "ttl": 60*60*24*365
  }),
  resave: false,
  saveUninitialized: true,
  secret: 'weixin'
}));

require('./config/route')(app);

app.use(weixin.handleMessage().message);

var rescode = require('./rescode');
/**
 * 全局错误处理函数，统一进行响应
 *
 * 使用方法：
 * a）next(100100) 返回100100对应用的状态码和默认message
 * b）next({rescode: 100100}) 返回100100对应用的状态码和默认message
 * c）next(ee) 数据库操作时返回的err，此时响应500错误
 */
app.use(function (err, req, res, next) {
  if(!err || res.headersSent) return next(err);
  if(err && typeof err === 'number') {
    res.json({rescode: err, resmsg: rescode[err]});
    return next(err);
  }
  if(err && err.rescode) {
    var resmsg = rescode[err.rescode];
    res.json({rescode: err.rescode, resmsg: resmsg});
  } else {
    res.status(500).json({rescode: 100500, resmsg: app.get('env') === 'product' ? rescode['100500']: err})
  }
  next(err);
});

module.exports = app;

