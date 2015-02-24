module.exports = function(app) {
    return {
        server: {
            port: 8888
        },
        supervisor: {            
            pollingInterval: 5000,
            maxForkNumber: 1
        },
        database: {
            driver   : 'mysql',
            host     : '127.0.0.1',
            user     : 'root',
            port     : '3306',
            password : '',
            database : 'async-job',
            connectionLimit : 10,
        },
        job_module: ['aj-video-encoder', 'aj-office-to-pdf'],
        
    };
};