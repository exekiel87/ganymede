#!/usr/bin/env node
(async ()=>{
const Queue = require('bull');
const {DB_CONF:dbConf,themisto:themistoEnv} = require('../configs/config');
const {
     redis,
     CONCURRENCY_JOBS
} = themistoEnv;

const Saver = require('./workers/saver');

const Client = require('../connect');

const Orders = require('../models/orders');
const Products = require('../models/products');
const Categories = require('../models/categories');

const client = Client(dbConf.DB_URL, dbConf.DB_NAME);
  
const connected = await client.connect();

const ping = await client.ping();

const db = client.db();

const orders = Orders(db);
const products = Products(db);
const categories = Categories(db);

const models = {orders, products, categories};

const {saveProducts} = Saver(models);




const saveQueue = new Queue('savesArrival',{redis});

const queues = [
    {
      name: 'savesArrival',
      hostId: 'saves',
      redis,
    }
];

saveQueue.process('saver', CONCURRENCY_JOBS, async (job) => {
    try{       
        
        const result = await saveProducts(job.data._id, job.data.products);
        
        await job.moveToCompleted('done', true);        

    }catch (err){
        await job.moveToFailed({message: err.stack});
        process.send({type:"error", data: {order: job.data._id}, message: 'fatal error'});

    }
});

process.on('message', (data) => {
    saveQueue.add('saver', data);
    
});

})();