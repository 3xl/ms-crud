'use strict';

const express           = require('express');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const compression       = require('compression');
const Kafka             = require('no-kafka');
const EventEmitter      = require('events');
const { Model, Router } = require('./src');

/**
 * 
 * 
 * @class Ms
 */
class Ms extends EventEmitter {
    
    /**
     * Creates an instance of Ms.
     * 
     * @param {Object} mongo 
     * @param {Array} models
     * 
     * @memberof Ms
     */
    constructor(mongo = {}, models = {}) {
        super();

        this.express   = express();
        this.mongo     = mongo;
        this.models    = models
        this.consumers = [];

        /**
         * Mongo connection
         * 
         */
        mongoose.Promise = global.Promise;

        mongoose.connect(this.mongo.connection, {
            user: this.mongo.user,
            pass: this.mongo.password
        });

        /**
         * Middlewares
         * 
         */
        this.express.use(bodyParser.json());
        this.express.use(helmet());
        this.express.use(compression());
        this.express.use(require('morgan')('combined'));

        /**
         * Routes and Models
         * 
         */
        this.express.set('models', this.models);

        this.express.use((req, res, next) => {
            // model reference
            let models = this.express.get('models');

            req.model = models[req.path.substring(1).split('/')[0]];

            // Ms reference
            req.ms = this;

            next();
        });

        Object.keys(this.models).forEach(modelName => {
            this.models[modelName] = new Model(modelName, this.models[modelName]);

            this.express.use('/' + modelName.toLowerCase(), Router);
        }, this);
    }

    /**
     * It handles the message intercepted by the kafka consumer 
     * 
     * @param {any} - messageSet
     * 
     * @private
     * 
     * @memberof Ms
     */
    _messageHandler(messageSet) {
        messageSet.forEach((m) => {
            let message = JSON.parse(m.message.value.toString('utf8'));
            
            if(this.log == 1) {
                console.log(new Date().toISOString(), 'Event consumed');
            }

            this.emit('KafkaEvent', message);
        });
    }

    /**
     * Add consumer kafka
     * 
     * @param {Object} kafkaConfig 
     * 
     * @public
     * 
     * @memberof Ms
     */
    addConsumer(kafkaConfig) {
        let consumer = new Kafka.SimpleConsumer({
            groupId:          kafkaConfig.groupName,
            clientId:         kafkaConfig.clientName,
            connectionString: kafkaConfig.host + ':' + kafkaConfig.port
        });

        consumer.init().then(() => {
            return consumer.subscribe(kafkaConfig.topic, [0], this._messageHandler.bind(this));
        });

        this.consumers.push(consumer);
    }

    /**
     * Start application
     * 
     * @param {Number} - port
     * 
     * @public
     * 
     * @memberof Ms
     */
    start(port) {
        this.express.set('port', port);

        this.express.listen(port, () => {
            console.log('Application started');
        });
    }

}

module.exports = Ms;