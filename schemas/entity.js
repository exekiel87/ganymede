const Joi = require('joi');



module.exports = function(){
    
    const createOrderSchema = Joi.object(
        {
            query: Joi.string().required(),
            provider: Joi.string().required(),
            callbackUrl:Joi.string().required()
        }
    ).required();
    
    return {
        createOrderSchema
    };
}