global.config        = require('./config')();
global.async         = require('async');
global.fs            = require('fs');
global.jobModule     = require('./system/libraries/job-module')();
global.child_process = require('child_process');

var cluster    = require('cluster');
var numCPUs    = require('os').cpus().length;
var server     = require('./server');


// if (cluster.isMaster) {
//     for (var i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on('listening', function(worker, address) {
//         console.log('A worker is now connected to ' + address.address + ':' + address.port);
//     });
//     cluster.on('exit', function(worker, code, signal) {
//         console.log('worker ' + worker.process.pid + ' died');
//         //cluster.fork();  //if died create new children
//     });
// } 
// else 
{    
    // var child_process = require('child_process');
    // var n = child_process.fork('./process/consumer.js');
    // console.log('Spawned child pid: ' + n.pid);
    // n.on('message', function(m) {
    //     console.log('PARENT got message:', m);
    // });
    // //n.send({ hello: 'world' });

    // var n2 = child_process.fork('./process/consumer.js');
    // console.log('Spawned child pid: ' + n2.pid);
    // n2.on('message', function(m) {
    //     console.log('PARENT got message:', m);
    // });
    // n2.send({ hello: 'world 222' });    ;


    jobModule.load(config.jobModules);
    
    // database start
    global.db = require('./system/database/' + config.database.driver);
    db.start(config.database);

    // httpd start
    server.start(config.server);

    var supervisor = child_process.fork('./system/supervisor.js');    
    supervisor.send({});
    
    supervisor.on('error', function(err) {
        console.log('supervisor error: ' + err);
    });

    supervisor.on('exit', function (code, signal) {        
        console.log('supervisor exit. code: ' + code + ' signal: ' + signal);
    });

    // send SIGHUP to process
    //supervisor.kill('SIGHUP');
}
