var jobModel  = require('../models/job')();

/*
    {
        job: 'video-encoder',
        config: {
            
        }
    }
*/

exports.create = function(req, res) {

    var data =  {
                    job: req.body.job,
                    config: req.body.config,
                    from: req.connection.remoteAddress,
                    agent: req.headers['user-agent']
                };

    jobModel.create(data, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }        
        res.json({status:200, msg:'ok', result: {uuid: result.uuid}});
    });
};

exports.progress = function(req, res) {
    var data = req.body;
    if (!data.uuid) {
        res.status(404).json({status:404, msg:'unknow job id'});
        return;
    }
    jobModel.getProgress(data.uuid, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:'not found job'});
            return;
        }
        if (!result) {
            res.status(404).json({status:404, msg:'not found job'});
            return;   
        }
        res.json({status:200, msg:'ok', result: result});
    });
};