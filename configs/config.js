if (process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

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
    REDIS_PORT,
    REDIS_HOST,
    REDIS_DB,
    CONCURRENCY_JOBS
  }
};

module.exports = config;
