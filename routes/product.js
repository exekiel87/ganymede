const express = require('express');
const Boom = require('@hapi/boom');
const stream = require('stream');
const util = require('util');
const JSONStream = require('JSONStream');

const pipe = util.promisify(stream.pipeline);

const validation = require('../utils/middlewares/validationHandler');

let created = false;

let router;

module.exports = function run(OrdersController, ProductsController, validations, themisto){

    if(router) return router;

    router = express.Router();

    const {
        createOrderSchema, 
        getOrderSchema,
        getProductsSchema } = validations;

    router.post('/api/product/search',
        validation(createOrderSchema),
        async function({body: search}, res, next) {
            try
            {
                search.status = 'received';
                
                const result = await OrdersController.insertOneAction(search);
                
                const order = result.insertedId;

                themisto.send(order);

        	    res.status(200).send({order});
            }
            catch (err)
            {
                next(err);
            }
        }
    );

    router.get('/api/product/search-order/:orderId',
        validation(getOrderSchema, 'params'),
        async function ({params}, res, next) {
            try{

                const {orderId:_id} = params;

                const order = await OrdersController.findOneAction(_id);

                if(order === null){
                    next(Boom.notFound())
                }else {
                    res.status(200).send({order});
                }

            }catch (err){
                next(err);
            }

        }
    );

    router.get('/api/product/search-orders',
        async function(req, res, next){

            try{
                const orders = OrdersController.findAllAction();

                res.statusCode = 200;
                
                const piped = await pipe(   orders,
                                            JSONStream.stringify(),
                                            res.type('json')
                                        );
            } catch (err){
                next(err);
            }
            
        }
    );

    router.get('/api/product/category/:categoryId', 
        validation(getProductsSchema, 'params'),
        async function({params}, res, next){

            try{

                const {categoryId} = params;

                const cant = await ProductsController.countAllByCategory(categoryId);

                if(!cant){
                    next(Boom.notFound());
                }else{
                    const products = ProductsController.findAllByCategory(categoryId);

                    res.statusCode = 200;

                    const piped = pipe( products, 
                                        JSONStream.stringify(),
                                        res.type('json')
                                    );
                }

                
            } catch (err){
                next(err);
            }
        }
    );

    return router;
}
