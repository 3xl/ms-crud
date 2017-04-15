#!/usr/bin/env node

'use strict';

require('dotenv').config({ silent: true });

const App = require('./app');

/**
 * Init application
 * 
 */
let app = new App(
    'mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB,
    process.env.MONGO_USER,
    process.env.MONGO_PASS,
    process.env.LOG
);

app.start(process.env.PORT);