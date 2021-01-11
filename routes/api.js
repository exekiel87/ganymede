const express = require('express');
const Product = require('./product');
    
let api;

module.exports = function () {

    if(api) return api;
    
    api = express.Router();    
    
    return api;
}
