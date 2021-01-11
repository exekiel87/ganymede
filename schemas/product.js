const Joi = require('joi');
const mongodb = require('mongodb');

module.exports = function(){
    
    const createOrderSchema = Joi.object(
        {
            query: Joi.string().required(),
            provider: Joi.string().required(),
            options: Joi.object(),
            callbackUrl:Joi.string().required()
        }
    ).required();

    const getOrderSchema = Joi.object({
        orderId: Joi.string().custom(validObjectId, 'objectId validation').required()
    }).required();

    const getProductsSchema = Joi.object({
        categoryId: Joi.string().custom(validObjectId, 'objectId validation').required()
    });


    function validObjectId(value, helpers){
        const message = 'it\'s not a valid objectID';

        const {original: _id} = helpers;  

        try{
            const oID = new mongodb.ObjectID(_id);

            return value;
        } catch (err){
            throw new Error(message);
        }        
    }
    
    return {
        createOrderSchema,
        getOrderSchema,
        getProductsSchema
    };
}