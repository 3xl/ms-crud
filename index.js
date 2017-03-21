#!/usr/bin/env node

'use strict';

require('dotenv').config({ silent: true });

const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

/**
 * Init Express application
 */
let app = express();

// express middleware
if(process.env.DEBUG == 1) {
    const morgan = require('morgan')
    
    app.use(morgan(':date[iso] :method :req[header] :url :status - :response-time ms'));
}

app.use(bodyParser.json());

// application port
app.set('port', process.env.PORT);

/**
 * Mongo connection
 */
let connection = mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB, {
    user: process.env.MONGO_USER, 
    pass: process.env.MONGO_PASS
});

/**
 * Routes
 */
let routes = require('./app/routes.js');

routes.forEach((route) => {
    app.use(route[0], route[1]);
});

/**
 * Start application
 */
let server = app.listen(app.get('port'), () => {
    console.log('Application started');
});