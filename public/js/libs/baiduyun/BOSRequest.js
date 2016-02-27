/**
 * Created by a on 2015/10/21.
 */
var crypto = require('crypto');
var fs = require('fs');
var http = require('http');
var settings = require('./settings');

module.exports = function BOSRequest(method, bucket, object, params, customHeaders, expire, data, callback) {
    bucket = bucket || '';
    object = object || '';
    params = params || {};
    callback = callback || console.log;
    var accessKeyId = settings.bos.ak;
    var secretAccessKey = settings.bos.sk;
    var requestDate = new Date().toISOString().slice(0, -5) + 'Z';

    var httpMethod = method;
    var path = ['/v1', bucket, normalize(object, true)].join('/');
    var headersToSign = [];
    var headers = {
        'host': 'bj.bcebos.com',
        'x-bce-date': requestDate
    };
    if(customHeaders != null) {
        for(var key in customHeaders) {
            headersToSign.push(key);
            headers[key] = customHeaders[key];
        }
    }
    if(data != null) {
        data = new Buffer(data);
        headers['Content-Type'] = 'application/octet-stream';
        headers['Content-Length'] = data.length;
    }
    var content = 'bce-auth-v1/'+ accessKeyId +'/'+ requestDate +'/' + expire;
    var SigningKey = crypto.createHmac('sha256', secretAccessKey).update(content).digest('hex');
    var CanonicalURI = path;
    var CanonicalQueryString = getCanonicalQueryString(params);
    var CanonicalHeaders = getCanonicalHeaders(headers);
    var CanonicalRequest = [httpMethod.toUpperCase(), CanonicalURI, CanonicalQueryString, CanonicalHeaders].join('\n');
    var Signature = crypto.createHmac('sha256', SigningKey).update(CanonicalRequest).digest('hex');
    headers.Authorization = [content, headersToSign.join(';'), Signature].join('/');

    var options = {
        host: headers.host,
        path: path+'?'+getCanonicalQueryString(params),
        method: httpMethod,
        headers: headers
    };
    var req = http.request(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        }).on('end', function () {
            try {
                data = eval('('+ data +')');
            } catch(e) {
            } finally {
                if(res.statusCode >= 300) {
                    callback(new Error(data.code), null);
                } else {
                    callback(null, data);
                }
            }
        }).on('error', function (err) {
            console.log(err);
            callback(err, null);
        })
    });
    req.end(data);

    function getCanonicalQueryString(params) {
        var result = [];
        for(var key in params) {
            if(key.toLowerCase() != 'authorization') {
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
        for(var key in headers) {
            var keyLower = key.toLowerCase();
            var value = headers[key].toString().trim();
            if(/^x-bce-/.test(keyLower) || new RegExp(keyLower).test(headersToSign)) {
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
        if(input == null) {
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