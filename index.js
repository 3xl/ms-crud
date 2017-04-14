#!/usr/bin/env node

'use strict';

require('dotenv').config({ silent: true });

const mongoose = require('mongoose');
const App      = require('./app');

/**
 * Mongo connection
 * 
 */
mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB, {
    user: process.env.MONGO_USER, 
    pass: process.env.MONGO_PASS
});

/**
 * Init application
 * 
 */
let app = new App();

if(process.env.LOG == 1) {
    const morgan = require('morgan');
    
    app.add(morgan('combined'));
}

app.start(process.env.PORT);