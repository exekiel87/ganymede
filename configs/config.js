

const {
  NODE_ENV,PORT,
  DB_URL,DB_NAME, 
  REDIS_PORT, REDIS_HOST, 
  REDIS_DB, CONCURRENCY_JOBS} = process.env;

const config = {
  NODE_ENV,
  PORT,
  DB_CONF: {
    DB_URL,
    DB_NAME
  },
  themisto:{
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      db: REDIS_DB,
    },
    
    CONCURRENCY_JOBS
  },
  providers: ['easy'],
  queues:[
    {
      name: 'searchsArrival',
      hostId: 'searchs',
      redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        db: process.env.REDIS_DB,
      }
    }
  ]
};

module.exports = config;
