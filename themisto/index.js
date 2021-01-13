#!/usr/bin/env node

const Queue = require('bull');
const {
     redis,
     CONCURRENCY_JOBS
  } = require('./configs/config');
const Easy = require('./workers/easy');
const {searchSchema} = require('./schemas/search');

const {searchEasyProducts} = Easy();
const searchQueue = new Queue('searchsArrival',{redis});

const queues = [
    {
      name: 'searchsArrival',
      hostId: 'searchs',
      redis,
    }
];

searchQueue.process('easy', CONCURRENCY_JOBS, async (job) => {
    try{
        process.send({type:1, data:{order: job.data._id}});
        
        const products = await searchEasyProducts(job.data);

        await job.moveToCompleted('done', true);
        process.send({type:2, data:{order: job.data._id,products}});

    }catch (err){

        await job.moveToFailed({message: err.stack});
        process.send({type:"error", data: {order: job.data._id}, message:'Fatal error'});

    }
});

process.on('message', (data) => {

    const {error} = searchSchema.validate(data);

    if(error){
        process.nextTick(() => {
            process.send({type:"typeError", data:{order: data._id}, error});
        });
    }else{
        searchQueue.add(data.provider, data);
    }
});