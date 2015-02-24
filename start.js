global.async         = require('async');
global.fs            = require('fs');
global.config        = require('./config')();
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
    
    loadJobModule(['aj-video-encoder', 'aj-office-to-pdf']);
    
    // database start
    global.db = require('./database/' + config.database.driver);
    db.start(config.database);

    // httpd start
    server.start(config.server);

    var supervisor = child_process.fork('./system/supervisor.js');
    config.supervisor.pid = supervisor.pid;
    supervisor.send(config.supervisor);
}



function loadJobModule(jobModule) {
    if( Object.prototype.toString.call( jobModule ) !== '[object Array]' ) {
        return false;
    }
    
    global.jobModule = {};
    jobModule.forEach(function (name) {        
        global.jobModule[name.replace('aj-', '')] = require(name);
    })    
}