var uuid = require('node-uuid');


module.exports = function() {
    return new Job();
};

function Job () {
}

/*
    data
    {
        job,    
        config,
        from,
        agent
    }
*/
Job.prototype.create = function (data, myCallback) {    
    if (!data.job) {        
        myCallback('unknow job type');
        return;
    }
    if (!jobModule.get(data.job)) {
        myCallback('unknow job type');
        return;
    }
    var config = JSON.stringify(data.config) || {};    
 
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
        myCallback(null, rows[0]);
    });
};

Job.prototype.getTopJob = function (myCallback) {
    db.query('SELECT id, uuid, job, config, status FROM job WHERE status="wait" ORDER BY id', [], function(err, rows) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, rows[0]);
    });
};

/*
    data
    {
        id,
        status,
        progress,
        log
    }
*/
Job.prototype.setStatus = function (data, myCallback) {
    var value = {};    
    if (!data.id) {
        myCallback('no id');
        return;
    }

    if (data.status && ['wait', 'start', 'finish', 'complete'].indexOf(data.status)) {
        value.status = data.status;
    }

    if (data.progress) {
        value.progress = data.progress;
    }

    if (data.log) {
        value.log = data.log;
    }

    db.query('UPDATE job SET ? WHERE id=?', [value, data.id], function(err, result) {
        if (err) {
            myCallback(err);
            return;
        }
        myCallback(null, result);
    });
};