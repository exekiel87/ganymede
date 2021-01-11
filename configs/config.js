if (process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_CONF: {
      DB_URL: process.env.DB_URL,
      DB_NAME: process.env.DB_NAME
  }
};

module.exports = config;
