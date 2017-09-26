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

/*
app.addConsumer({
    host:       process.env.KAFKA_HOST,
    port:       process.env.KAFKA_PORT,
    clientName: process.env.KAFKA_CLIENT_NAME,
    topic:      process.env.KAFKA_TOPIC,
    groupName:  process.env.KAFKA_GROUP_NAME
});

app.on('KafkaEvent', (message) => {
    console.log(message)
});
*/

app.getServiceInstance('items');
app.start(process.env.PORT);