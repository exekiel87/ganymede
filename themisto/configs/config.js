if (process.env.NODE_ENV === 'develop')
{
  require('dotenv').config();
}


const {NODE_ENV, REDIS_PORT, REDIS_HOST, REDIS_DB, CONCURRENCY_JOBS} = process.env;

const config = {
  NODE_ENV:NODE_ENV,
  redis: {
    port: REDIS_PORT,
    host: REDIS_HOST,
    db: REDIS_DB,
  },
  providers: ['easy'],
  CONCURRENCY_JOBS
};

module.exports = config;
