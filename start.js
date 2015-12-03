global.config        = require('./config')();
global.async         = require('async');
global.fs            = require('fs');
global.jobModule     = require('./system/libraries/JobModule')();
global.child_process = require('child_process');

var server     = require('./server');

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

