const path = require('path');

const {DB_CONF:dbConf} = require('../configs/config');

const args = require('minimist')(process.argv.slice(2),{
    boolean: ['up', 'down', 'clean']
});

const Client = require('../connect');

const fs = require('fs');

let db;

async function main(){
    const client = Client(dbConf.DB_URL, dbConf.DB_NAME);

    const connected = await client.connect();

    const ping = await client.ping();

    db = client.db();

    if(args.clean){
        const result = await db.dropDatabase();

        if(!args.up){
            process.exit(0);
            return;
        }
    }

    fs.readdir('./migrations', async function (err, files) {
        if (err) {
            onError(err);
            return;
        }
    
        let exec;
    
        if(args.up){
            exec = up(files);
        }else if(args.down){
            exec = down(files.reverse());
        }
    
        const result = await exec;
    
        process.exit(0);
        
    });

}



async function up(files){
    let result;
    for(file of files){
        const filePath = path.resolve('migrations', file);
        const migration = require(filePath);
        
        result = await migration.up(db);
    }
}

async function down(files){
    let result;
    for(file of files){
        const filePath = path.resolve('migrations', file);
        const migration = require(filePath);
        
        result = await migration.down(db);
    }
}

main();