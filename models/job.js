var uuid = require('node-uuid');


module.exports = function() {
    return new Job();
};

function Job () {
}

Job.prototype.create = function (data, myCallback) {
    async.waterfall([
        function(callback) {
            var find = true;
            var newUUID;
            var count = 0;
            async.doWhilst(
                function (whileCallback) {
                    newUUID = uuid.v4();
                    db.query('SELECT uuid FROM job WHERE uuid=?', [newUUID], function(err, rows) {
                        if (err) {
                            whileCallback(err);
                            return;
                        }
                        if (!rows[0]) {
                            find = false;
                        }
                        whileCallback();
                    });
                },
                function () {
                    return find;
                },
                function (err) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, newUUID);
                }
            );
        },
        function(newUUID, callback) {
            var config = JSON.stringify(data.config);
            var values = {
                            uuid: newUUID,
                            job: data.job,
                            config: config,
                            from: data.from,
                            agent: data.agent
                         };

            db.query('INSERT INTO job SET recordTime=NOW(), ? ', values, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, {id: result.insertId, uuid: newUUID});
            });
        }        
    ], function (err, result) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, result);
    });
};

Job.prototype.getProgress = function (uuid, myCallback) {
    db.query('SELECT uuid, status, progress FROM job WHERE uuid=?', [uuid], function(err, rows) {
        if (err) {
            myCallback(err);
            return;
        }
        if (!rows[0]) {
            myCallback("not found job");
            return;
        }
        myCallback(null, rows[0]);
    });
}