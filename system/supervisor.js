global.config     = require('../config')();
global.jobModule  = require('../system/libraries/jobModule')();
global.child_process = require('child_process');
var jobModel      = require('../models/job')();

global.db = require('../system/database/' + config.database.driver);
db.start(config.database);

jobModule.load(config.jobModules);


process.on('message', function() {
    var sv = new Supervisor(this.pid);
    sv.run();

});


function Supervisor (pid) {
    this.pid = pid;
    this.fork = [];
    this.pollingInterval = config.supervisor.pollingInterval || 5000;
    this.maxForkNumber = config.supervisor.maxForkNumber || 1;
}

Supervisor.prototype.run = function () {
    var that = this;

    if (that.fork.length >= that.maxForkNumber) {
        that.polling();
        return;
    }


    jobModel.getTopJob(function(err, job){
        if (err) {
            console.log('get job error: ' + err);
			that.polling();
            return;
        }

        if (!job) {
            console.log('job is empty');
            that.polling();
            return;
        }
        
        if (!jobModule.get(job.job)) {
            console.log('unknow job type: ' + job.job);
            jobModel.setStatus ({
                                    id: job.id, 
                                    status: 'error', 
                                    log: 'unknow job type: ' + job.job
                                }, 
                                function(err, result) {
                                    that.polling();
                                }
            );            
            return;
        }
        var consumer = child_process.fork('./system/consumer.js');

        /*
            todo: timeout monitor
            set number of milliseconds since 1970/01/01
        */
        consumer.startTime = new Date().getTime();
        
        that.fork.push(consumer);
        // console.log(that.fork.map(function(e){return e.pid;}));
        // console.log(consumer);
        consumer.send(job);

        consumer.on('error', function(err) {
            console.log('consumer error: ' + err);
            var index = that.fork.map(function(e){return e.pid;}).indexOf(this.pid);
            if (index >= 0){
                that.fork.splice(index, 1);
            } 
        });

        consumer.on('exit', function (code, signal) {
            console.log('consumer exit. pid: ' + this.pid + ' code: ' + code + ' signal: ' + signal);
            var index = that.fork.map(function(e){return e.pid;}).indexOf(this.pid);
            if (index >= 0){
                that.fork.splice(index, 1);
            }
            // console.log(that.fork.map(function(e){return e.pid;}));
        });

        that.polling();
    });
};

Supervisor.prototype.polling = function () {
    var that = this;
    setTimeout(function(){
        that.run();
    }, that.pollingInterval);
};