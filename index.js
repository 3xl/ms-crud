#!/usr/bin/env node

'use strict';

require('dotenv').config({ silent: true });

const App = require('./app');

/**
 * Init application
 * 
 */
let app = new App(
    {
        user:       process.env.MONGO_USER,
        password:   process.env.MONGO_PASS,
        connection: process.env.MONGO_CONNECTION
    },
    process.env.LOG
);

// app.addConsumer({
//     host:       process.env.KAFKA_HOST,
//     port:       process.env.KAFKA_PORT,
//     clientName: process.env.KAFKA_CLIENT_NAME,
//     topic:      process.env.KAFKA_TOPIC,
//     groupName:  process.env.KAFKA_GROUP_NAME
// });

// app.on('KafkaEvent', (message) => {
//     console.log(message)
// });

app.start(process.env.PORT);