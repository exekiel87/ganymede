const Boom = require('@hapi/boom');
const isReqAjaxOrApi = require('../isReqAjaxOrApi');
const config = require('../../configs/config');

function withErrorStack(err, stack)
{
    const inDev = config.NODE_ENV !== 'production';
    
    if(inDev)
    {
         return {...err, stack};
    }
    
    return err;
}

function wrapErrors(err, req, res, next)
{
    if(!err.isBoom)
    {
        next(Boom.badImplementation(null,err));
        return;
    }

    next(err);
}

function logErrors(err, req, res, next)
{
    next(err);
}

function clientErrorHandler(err, req, res, next)
{
    const {data,output: {statusCode, payload} } = err;
    
    //cath errors for ajax request or if errors ocurrs while streaming    
    if(isReqAjaxOrApi(req) || res.headerSent){console.log('statuuuus ', statusCode);
        res.status(statusCode).json(withErrorStack({payload, data}, err.stack));
    }else{
        next(err);
    }
}

function errorHandler(err, req, res, next)
{
    const {output: {statusCode, payload} } = err;
    let {data} = err;
    
    data = JSON.stringify(data);

    res.status(statusCode).render('error', withErrorStack({payload, data}, err.stack));
}

module.exports = {    
    wrapErrors,
    logErrors,
    clientErrorHandler,
    errorHandler
}