

process.on('message', function(config) {
    console.log(config);
    var sp = new supervisior(config);
    sp.run();
});


function supervisior (config) {
    this.pollingInterval = config.pollingInterval || 5000;
    this.maxForkNumber = config.maxForkNumber || 1;    
}

supervisior.prototype.run = function () {
    var that = this;


    setTimeout(function() {
        that.run();
    }, this.pollingInterval);
};

