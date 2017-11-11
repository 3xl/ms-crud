'use strict';

const express           = require('express');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const compression       = require('compression');
const EventEmitter      = require('events');
const { Model, Router } = require('./src');

/**
 * Main Microservice class
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
         * Set a reference to the microservice instance in Express.
         * It's useful inside an Express middleware
         * 
         */
        this.express.set('ms', this);

        /**
         * Middlewares
         * 
         */
        this.express.use(bodyParser.json());
        this.express.use(helmet());
        this.express.use(compression());
        this.express.use(require('morgan')('combined'));
        this.express.use(this._selecteModel);

        /**
         * Routes and Models
         * 
         */
        Object.keys(this.models).forEach(modelName => {
            // models instance creation 
            this.models[modelName] = new Model(modelName, this.models[modelName]);

            // routes registration
            this.express.use('/' + modelName.toLowerCase(), Router);
        }, this);
    }

    /**
     * It selects the correct model starting from the base path of route
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     * 
     * @private
     * 
     * @memberof Ms
     */
    _selecteModel(req, res, next) {
        let models = req.app.get('ms').models;

        req.model = models[req.path.substring(1).split('/')[0]];

        next();
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