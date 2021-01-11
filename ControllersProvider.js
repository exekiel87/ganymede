const {connect} = require('./connect');

const models = {};
const connection = {models};
const conf = require('./configs/config');

connect().then((db) =>{
  connection.db = db;
  
  models.Orders = require('./models/orders')(db.collection('orders'));
  models.Products = require('./models/products')(db.collection('products'));
});

const OrdersController = require('./controllers/OrdersController')(connection, conf);
const ProductsController = require('./controllers/ProductsController')(connection, conf);

module.exports = {
  OrdersController,
  ProductsController
}