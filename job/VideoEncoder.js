module.exports = function(a) {
    return new VideoEncoder(a);
};

function VideoEncoder (a) {
    this.a = a;
    console.log('videoencoder init');
}

VideoEncoder.prototype.create = function (my_callback) {
    console.log(this.a);
};