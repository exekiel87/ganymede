var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const Boom = require('@hapi/boom');

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
const {themisto: themistoEnv} = require('./configs/config');
const themisto =   fork(
                    './themisto/index.js',
                    [],
                    {
                        stdio:'ignore' ,
                        env: themistoEnv
                    }
                );


module.exports = async function run(dbConf){

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

  themisto.on('message', (res) => {
  
    const {type, data} = res;
    const {order, products} = data;

    switch(type){
        case 1:{
          themistoController.orderProcessingAction(order);
        }

        case 2:{
          themistoController.orderCompletedAction(order, products);
        }

        case "error":{
          themistoController.orderFailAction(order);
        }

        case "typeError":{
          themistoController.orderInvalidAction(order);
        }
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
  app.use(function(req, res, next){
    next(Boom.notFound());
  });*/
  
  app.use(wrapErrors);
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  
  return app;
};
