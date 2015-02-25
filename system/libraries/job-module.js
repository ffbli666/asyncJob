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
    jobModules.forEach(function (name) {
        that.modules[name.replace('aj-', '')] = require(name);
    });    
}

JobModule.prototype.get = function(name) {     
    if (Object.prototype.toString.call(this.modules[name]) !== '[object Function]') {
        return false;
    }
    return this.modules[name];
}