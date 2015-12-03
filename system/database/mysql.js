var mysql   = require('mysql');

exports.start = function (config) {
    this.pool = mysql.createPool(config);
    this.pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });
};

exports.query = function(string, arg, callback) {
    this.pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(string, arg, function (err, rows){
            if (err) throw err;
            connection.release();
            callback(err, rows);
        });
    });
};

exports.close = function(){
    this.pool.end(function (err) {
        // all connections in the pool have ended
    });
};