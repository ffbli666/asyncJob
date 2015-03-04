module.exports = function(app) {    
    return {
        system: {
            publicPath: './public', //express htdoc
            tmpPath: './tmp'
        },
        server: {
            hostname: 'localhost',
            port: 8888
        },
        supervisor: {            
            pollingInterval: 5000,
            maxForkNumber: 2
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
        jobModules: [
                        {
                            app: 'aj-office-to-pdf',
                            options: {                                
                                wget: 'D:/software/wget-1.11.4-1-bin/bin/wget.exe',
                                publicPath: './public', //express htdoc
                                tmpPath: './tmp',
                                officeToPDF: './node_modules/aj-office-to-pdf/bin/OfficeToPDF.exe'
                            }
                        }
                    ],
        
    };
};
