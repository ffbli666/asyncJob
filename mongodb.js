
var fs = require('fs');
//var models = ['users', 'notifications'];
var mongoose = require('mongoose');

exports.start = function(config) {    
    mongoose.connect( 'mongodb://' + config.host + ':' + config.port + '/' + config.db
                    , {server: {poolSize: config.poolSize}});
/*  
    for (key in models) {
        //console.log(models[key]);
        this[models[key]] = require('./models/'+ models[key])();
    }
*/
    var self = this;
    var models_path = __dirname + '/models';
    fs.readdirSync(models_path).forEach(function (file) {        
        var key = file.slice(0, file.lastIndexOf('.js'));        
        self[key] = require(models_path+'/'+file)();
    })
}

exports.close = function() {
    mongoose.connection.close();
}