global.config     = require('../config')();
global.jobModule  = require('../system/libraries/JobModule')();
var jobModel      = require('../models/job')();

global.db = require('../system/database/' + config.database.driver);
db.start(config.database);

jobModule.load(config.jobModules);

process.on('message', function(job) {
    var consumer = jobModule.get(job.job);
    var jobConfig = JSON.parse(job.config);
    var progress = new Progress(job);
    jobConfig.uuid     = job.uuid;
    jobConfig.hostname = config.server.hostname;
    jobConfig.port     = config.server.port;

    jobModel.setStatus({id: job.id, status: 'start'}, function(err, result) {
        consumer.run(jobConfig, progress, function(err, result){
            if (err) {
                jobModel.setStatus({id: job.id, status: 'error', log: err}, function(err, result) {
                    process.exit();
                });
                return;
            }
            jobModel.setStatus({id: job.id, status: 'complete', log: result}, function(err, result) {
                process.exit();
            });
        });
    });
});

function Progress (job) {
    function set(percent, callback) {
        jobModel.setStatus({id: job.id, progress: percent}, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    }
    return {set: set}
}