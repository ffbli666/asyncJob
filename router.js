var async = require('async');
module.exports = function(app) {    
    //router
    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });

    app.post('/post', function (req, res) {
        res.send('POST a new job request');
        console.log(req.body);                
    });

    var job = require('./controllers/job');
    app.post('/api/job', job.create);
    app.post('/api/progress', job.progress);
    app.get('*', notFound);
};

function notFound(req, res)
{
    res.status(404).send('Page Not Found');
}
