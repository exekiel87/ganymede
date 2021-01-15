const Joi = require('joi');
const { providers } = require('../../configs/config');

const searchSchema = 
Joi.object({
    _id:
        Joi.string()        
        .required(),
    query:
        Joi.string()        
        .required(),
    provider:
        Joi.string()
        .required()
        .custom(providerValidator, 'provider validator')
}).required();

function providerValidator(value, helpers){
    const message = 'it\'s not a valid provider';
    
    const {original: data} = helpers;

    if(!providers.includes(data)){
        throw new Error(message);
    }

    return value;
}

module.exports = {
    searchSchema
};
