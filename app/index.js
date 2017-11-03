'use strict';

const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const helmet       = require('helmet');
const compression  = require('compression');
const Rx           = require('rx');
const fs           = require('fs');
const path         = require('path');
const Kafka        = require('no-kafka');
const EventEmitter = require('events');

/**
 * 
 * 
 * @class App
 */
class App extends EventEmitter {
    
    /**
     * Creates an instance of App.
     * 
     * @param {Object} mongo 
     * @param {Number} log
     * 
     * @memberof App
     */
    constructor(mongo = {}, log = 0) {
        super();

        this.express   = express();        
        this.mongo     = mongo;
        this.log       = log;
        this.consumers = [];

        this._config();
    }

    /**
     * Configure express middlewares
     * 
     * @private
     * 
     * @memberof App
     */
    _config() {
        this.express.use(bodyParser.json());

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
         * Logs
         * 
         */
        if(this.log == 1) {
            this.express.use(require('morgan')('combined'));
        }

        /**
         * Security
         * 
         */
        this.express.use(helmet());

        /**
         * Enable GZip compression
         * 
         */
        this.express.use(compression());

        /**
         * Resources
         * 
         */
        let resources = this._getResources();

        // 1. Models
        this.express.set('models', resources.models);

        // 2. Routes
        // Extract the model name from the baseUrl property of the request
        // Add a reference to thi class
        this.express.use((req, res, next) => {
            // model
            let models = this.express.get('models');

            req.model = models[req.path.substring(1).split('/')[0]];

            // App reference
            req.ms = this;

            next();
        })

        resources.routes.forEach((route) => {
            this.express.use(route[0], route[1]);
        });
    }

    /**
     * It handles the message intercepted by the kafka consumer 
     * 
     * @param {any} - messageSet
     * 
     * @private
     * 
     * @memberof App
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
     * Load all the models and create the corresponding routes
     * 
     * @private
     * 
     * @return {Object}
     * 
     * @memberof App
     */
    _getResources() {
        let modelsFolder  = __dirname + '/models';
        let routersFolder = __dirname + '/http/routers';

        let models = [];
        let routes = [];

        if(fs.existsSync(modelsFolder)) {
            fs.readdirSync(modelsFolder)
                .filter((file) => {
                    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
                })
                .forEach((file) => {
                    // Models
                    let modelModule = require(path.join(modelsFolder, file)),
                        model       = file.slice(0, -3).toLowerCase();
                    
                    // Routers
                    let routerFile = fs.existsSync(path.join(routersFolder, file)) ? path.join(routersFolder, file) : path.join(routersFolder, 'BaseRouter.js');

                    let router = require(routerFile),
                        route  = '/' + file.slice(0, -3);

                    models[model] = modelModule;
                    routes.push([route, router]);
                });
        }

        return {
            models: models,
            routes: routes
        };
    }

    /**
     * Add consumer kafka
     * 
     * @param {Object} kafkaConfig 
     * 
     * @public
     * 
     * @memberof App
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
     * Return a reference to the service associated with the model
     * 
     * @param {String} modelName 
     * 
     * @public
     * 
     * @return {Service}
     * 
     * @memberof App
     */
    getService(modelName) {
        modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

        let Service = require('./services/' + modelName + 'Service.js');

        return new Service();
    }
    
    /**
     * Return a reference to the model
     * 
     * @param {String} modelName 
     * 
     * @public
     * 
     * @return {Model}
     * 
     * @memberof App
     */
    getModel(modelName) {
        modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

        return require('./models/' + modelName + '.js');
    }

    /**
     * Start application
     * 
     * @param {Number} - port
     * 
     * @public
     * 
     * @memberof App
     */
    start(port) {
        this.express.set('port', port);

        this.express.listen(port, () => {
            console.log('Application started');
        });
    }

}

module.exports = App;