const superTest = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

function testServer(route){
    const app = require('../app')();

    app.use('/', route);
    
    return superTest(app);
}

module.exports = testServer;
