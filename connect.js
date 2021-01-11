const MongoClient = require('mongodb').MongoClient;

module.exports = function(url, dbName){
    let client = null;
    let connection;

    function connect() {
        if (client === null) {            
            client = new MongoClient(url, { useUnifiedTopology: true });
            
            connection = client.connect();            
        }

        return connection;
    }
    
    function db() {
        return client.db(dbName);
    }
    
    function close() {
        if (client) {
            client.close();
            client = null;
        }
    }

    function ping(){
        const ping = client.db(dbName).command({ ping: 1 });

        return ping
    }
    
    return  {
                connect,
                ping,
                db,
                close
            };
}