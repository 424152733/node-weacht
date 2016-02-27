/**
 * Created by a on 2015/10/21.
 */
var BOSRequest = require('./BOSRequest');
var settings = require('./settings');
var BOSRequest2 = require('./getBosUrl');

module.exports = BOS = {
    listBuckets: function (cb) {
        BOSRequest('GET', null, null, null, null, settings.bos.expire, null, cb);
    },
    putBucket: function (bucket, cb) {
        BOSRequest('PUT', bucket, null, null, null, settings.bos.expire, null, cb);
    },
    deleteBucket: function (bucket, cb) {
        BOSRequest('DELETE', bucket, null, null, null, settings.bos.expire, null, cb);
    },
    listObjects: function (bucket, prefix, marker, maxKeys, cb) {
        BOSRequest('GET', bucket, null, {
            prefix: prefix,
            marker: marker,
            maxKeys: maxKeys
        }, null, settings.bos.expire, null, cb);
    },
    putObject: function (bucket, object, data, cb) {
        BOSRequest('PUT', bucket, object, null, null, settings.bos.expire, data, cb);
    },
    deleteObject: function (bucket, object, cb) {
        BOSRequest('DELETE', bucket, object, null, null, settings.bos.expire, null, cb);
    },
    getObject: function (bucket, object, range, cb) {
        BOSRequest('GET', bucket, object, null, !range?null:{
            range: 'bytes='+range
        }, settings.bos.expire, null, cb);
    },
    getUrl:function(bucket, object,cb){
        BOSRequest2('GET', bucket, object, null, null, settings.bos.expire, null, cb);
    }
};