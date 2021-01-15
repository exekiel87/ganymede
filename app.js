var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const Boom = require('@hapi/boom');
//const Bull = require('bull');
//sconst Arena = require('bull-arena');

const isReqAjaxOrApi = require('./utils/isReqAjaxOrApi');
const {wrapErrors, logErrors, clientErrorHandler, errorHandler} = require('./utils/middlewares/errorHandler');

const Client = require('./connect');

const Orders = require('./models/orders');
const Products = require('./models/products');
const Categories = require('./models/categories');

const Validations = require('./schemas/product');

const OrdersController = require('./controllers/OrdersController');
const ProductsController = require('./controllers/ProductsController');
const ThemistoController = require('./controllers/themistoController');

const ProductRoute = require('./routes/product');
const ApiRoute  = require('./routes/api');
//const themisto  = require('./themisto');

const {fork} = require('child_process');
const {DB_CONF,themisto: themistoEnv} = require('./configs/config');
let themisto =   fork(
                    './themisto/index.js',
                    [],
                    {
                        stdio: 'inherit',
                        env: {
                          REDIS_PORT:themistoEnv.redis.port,
                          REDIS_HOST:themistoEnv.redis.host,
                          REDIS_DB:themistoEnv.redis.db,
                          CONCURRENCY_JOBS:themistoEnv.CONCURRENCY_JOBS
                        }
                    }
                );

let saver =   fork(
                    './saver/index.js',
                    [],
                    {
                        stdio: 'inherit',
                        env: {
                          REDIS_PORT:themistoEnv.redis.port,
                          REDIS_HOST:themistoEnv.redis.host,
                          REDIS_DB:themistoEnv.redis.db,
                          CONCURRENCY_JOBS:themistoEnv.CONCURRENCY_JOBS,
                          DB_URL: DB_CONF.DB_URL,
                          DB_NAME:DB_CONF.DB_NAME
                        }
                    }
                );


themisto.on('error',(err) =>{
  
});
module.exports = async function run(dbConf,queues){

  const client = Client(dbConf.DB_URL, dbConf.DB_NAME);
  
  const connected = await client.connect();

  const ping = await client.ping();

  const db = client.db();

  const orders = Orders(db);
  const products = Products(db);
  const categories = Categories(db);

  const models = {orders, products, categories};

  const ordersController = OrdersController(models);
  const productsController = ProductsController(models);
  const themistoController = ThemistoController(models);

  const validations = Validations();

  const productRoute = ProductRoute(ordersController, productsController, validations, themisto);
  const apiRoute = ApiRoute();

  themisto.on('message',async (res) => {
  
    const {type, data} = res;
    const {order, products} = data;
    let result;
    try{
    switch(type){
        case 1:{
          result = await themistoController.orderProcessingAction(order);
          break;
        }

        case 2:{
          //result = await themistoController.orderCompletedAction(order, products);
          saver.send({_id:order,products});
          break;
        }

        case "error":{
          result = await themistoController.orderFailAction(order);
          break;
        }

        case "typeError":{
          result = await themistoController.orderInvalidAction(order);
          break;
        }
    }

  }catch (err){
    
  }
  });

  apiRoute.use(productRoute);

  const app = express();
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/', apiRoute);
/*
  const arenaConfig = Arena(
    {
      Bull,
      queues,
    },
    {
      basePath: '/arena',
      disableListen: true,
    }
  );

  app.use('/', arenaConfig);*/
  /*
  app.use(function(req, res, next){
    next(Boom.notFound());
  });*/
  
  app.use(wrapErrors);
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  
  return app;
};
