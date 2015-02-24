var job_model  = require('../models/job')();

/*
    {
        job: 'video-encoder',
        config: {
            
        }
    }
*/

exports.create = function(req, res) {
    var data = req.body;

    if (!data.job) {
        res.status(404).json({status:404, msg:'unknow job type'});
        return;
    }
        
    if (Object.prototype.toString.call(jobModule[data.job]) !== '[object Function]') {
        res.status(404).json({status:404, msg:'unknow job type'});
        return;
    }
    var config = data.config || {};
    var data =  {
                    job: data.job,
                    config: config,
                    from: req.connection.remoteAddress,
                    agent: req.headers['user-agent']
                };
    job_model.create(data, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }        
        res.json({status:200, msg:'ok', result: {uuid: result.uuid}});
    })    
};

exports.progress = function(req, res) {
    var data = req.body;
    if (!data.uuid) {
        res.status(404).json({status:404, msg:'unknow job id'});
        return;
    }
    job_model.getProgress(data.uuid, function(err, result) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }        
        res.json({status:200, msg:'ok', result: result});
    })  
};