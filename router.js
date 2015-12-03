var async = require('async');
module.exports = function(app) {
    var job = require('./controllers/job');
    app.post('/api/job', job.create);
    app.post('/api/progress', job.progress);
    app.get('*', notFound);
};

function notFound(req, res)
{
    res.status(404).send('Page Not Found');
}
