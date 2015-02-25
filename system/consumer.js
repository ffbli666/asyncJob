global.config     = require('../config')();
global.jobModule  = require('../system/libraries/job-module')();
var jobModel      = require('../models/job')();

global.db = require('../system/database/' + config.database.driver);
db.start(config.database);

jobModule.load(config.jobModules);


process.on('message', function(job) {
    

    var module = jobModule.get(job.job);    
    var consumer = new module();
    console.log(consumer);

    var config = JSON.parse(job.config);
    consumer.run(config, function(err, result){
        if (err) {
            jobModel.setStatus({id: job.id, status: 'error', log: err}, function(err, result) {
                process.disconnect();
            });
            return;
        }        
        // jobModel.setStatus({id: job.id, status: 'complete', log: result}, function(err, result) {
        //     process.disconnect();
        // });
        process.disconnect();
    });
});