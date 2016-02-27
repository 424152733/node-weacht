var oracle = require('oracle');
var config = require('config');

var connectData = {
    hostname: config.get('oracle.hostname'),
    port: config.get('oracle.port'),
    database: config.get('oracle.database'),
    user: config.get('oracle.user'),
    password: config.get('oracle.password')
};

exports.getConnection = function(){
    oracle.connect(connectData, function(err, connection) {
        if(err) {
            console.log('oracle connection fail!:', err);
            return;
        }
        global.connection = connection;
        console.log('oracle connection success！')
    });
};
