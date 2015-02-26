module.exports = function() {    
    return new JobModule();
};


function JobModule () {
    this.modules = {};
}


JobModule.prototype.load = function (jobModules) {
    var that = this;

    if( Object.prototype.toString.call( jobModules ) !== '[object Array]' ) {
        return false;
    }    
    jobModules.forEach(function (item) {
        var app = require(item.app);
        that.modules[item.app.replace('aj-', '')] = new app(item.config);
    });    
}

JobModule.prototype.get = function(name) {    
    if (Object.prototype.toString.call(this.modules[name]) !== '[object Object]') {
        return false;
    }
    return this.modules[name];
}