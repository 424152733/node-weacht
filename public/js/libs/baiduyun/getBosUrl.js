/**
 * Created by a on 2015/10/22.
 */
var crypto = require('crypto');
var fs = require('fs');
var http = require('http');
var settings = require('./settings');

module.exports = function BOSRequest2(method, bucket, object, params, customHeaders, expire, data, callback) {
    bucket = bucket || '';
    object = object || '';
    params = params || {};
    callback = callback || console.log;
    var accessKeyId = settings.bos.ak;
    var secretAccessKey = settings.bos.sk;
    var requestDate = new Date().toISOString().slice(0, -5) + 'Z';

    var httpMethod = method;
    var path = ['', normalize(object, true)].join('/');
    console.log(path);
    var headersToSign = [];
    var headers = {
        'host': bucket + '.bj.bcebos.com'
    };
    if (customHeaders != null) {
        for (var key in customHeaders) {
            headersToSign.push(key);
            headers[key] = customHeaders[key];
        }
    }

    var content = 'bce-auth-v1/' + accessKeyId + '/' + requestDate + '/' + expire;
    var SigningKey = crypto.createHmac('sha256', secretAccessKey).update(content).digest('hex');
    var CanonicalURI = path;
    var CanonicalQueryString = getCanonicalQueryString(params);
    var CanonicalHeaders = getCanonicalHeaders(headers);
    var CanonicalRequest = [httpMethod.toUpperCase(), CanonicalURI, CanonicalQueryString, CanonicalHeaders].join('\n');
    var Signature = crypto.createHmac('sha256', SigningKey).update(CanonicalRequest).digest('hex');
    headers.Authorization = [content, headersToSign.join(';'), Signature].join('/');

    while(headers.Authorization.indexOf("/")>0||headers.Authorization.indexOf(":")>0){
        if(headers.Authorization.indexOf("/")>0){
            var num1 = headers.Authorization.indexOf("/");
            var message1 = headers.Authorization.substr(0,num1);
            var message2 = headers.Authorization.substr(num1+1);
            headers.Authorization=message1+"%2F"+message2;
        }
        if(headers.Authorization.indexOf(":")>0){
            var num2 = headers.Authorization.indexOf(":");
            var message3 = headers.Authorization.substr(0,num2);
            var message4 = headers.Authorization.substr(num2+1);
            headers.Authorization=message3+"%3A"+message4;
        }
    }

    var myUrl = "http://"+bucket+".bj.bcebos.com"+path+"?authorization="+headers.Authorization;

    console.log("这里是请求的headers");
    console.log(headers);
    console.log("这里是myUrl");
    console.log(myUrl);

    callback(myUrl);

    function getCanonicalQueryString(params) {
        var result = [];
        for (var key in params) {
            if (key.toLowerCase() != 'authorization') {
                result.push(normalize(key) + '=' + normalize(params[key]));
            }
        }
        result.sort();
        return result.join('&');
    }

    function getCanonicalHeaders(headers) {
        headersToSign = ['host', 'content-md5', 'content-length', 'content-type'].concat(headersToSign);
        var result = [];
        var tempHeaderToSign = [];
        for (var key in headers) {
            var keyLower = key.toLowerCase();
            var value = headers[key].toString().trim();
            if (/^x-bce-/.test(keyLower) || new RegExp(keyLower).test(headersToSign)) {
                var temp = normalize(keyLower) + ':' + normalize(value);
                tempHeaderToSign.push(normalize(keyLower));
                result.push(temp);
            }
        }
        headersToSign = tempHeaderToSign.sort();
        result.sort();
        return result.join('\n');
    }

    function normalize(input, exceptSlash) {
        var result = '';
        if (input == null) {
            return result;
        }
        input = input.toString();
        for (var i = 0; i < input.length; i++) {
            var ch = input.charAt(i);
            if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '_' || ch == '-' || ch == '~' || ch == '.') {
                result += ch;
            } else if (ch == '/') {
                result += !exceptSlash ? '%2F' : ch;
            } else {
                result += '%' + new Buffer(ch).toString('hex').toUpperCase();
            }
        }
        return result;
    }
};
