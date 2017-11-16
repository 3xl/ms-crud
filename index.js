'use strict';

const express                          = require('express');
const mongoose                         = require('mongoose');
const bodyParser                       = require('body-parser');
const helmet                           = require('helmet');
const compression                      = require('compression');
const EventEmitter                     = require('events');
const { Resource, Router, Controller } = require('./src');

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
     * @param {Object} resources
     * 
     * @memberof Ms
     */
    constructor(mongo = {}, resources = {}) {
        super();

        this.express   = express();
        this.mongo     = mongo;
        this.resources = resources
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
        this.express.use(this._selecteResource);

        /**
         * Routes and Models
         * 
         */
        Object.keys(this.resources).forEach(resourceName => {
            
            // resources instance creation 
            this.resources[resourceName].instance = new Resource(resourceName, this.resources[resourceName].properties);

            // default crud routes registration
            this.express.use('/' + resourceName.toLowerCase(), Router);

            // custom routes registration
            if (this.resources[resourceName].routes && this.resources[resourceName].routes.length) {
                let routes = this.resources[resourceName].routes;
                
                routes.forEach(route => {
                    let method = route.method ? route.method.toLowerCase() : 'get';
                    let path = '/' + resourceName.toLowerCase() + route.path;

                    this.express[method](path, route.handler);
                }, this);
            }

        }, this);
    }

    /**
     * It selects the correct resource starting from the base path of route
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     * 
     * @private
     * 
     * @memberof Ms
     */
    _selecteResource(req, res, next) {
        let resources = req.app.get('ms').resources;

        req.resource = resources[req.path.substring(1).split('/')[0]].instance;

        next();
    }

    /**
     * It returns the Mongoose model of the resource
     * 
     * @param {String} resourceName 
     * 
     * @returns {Mongoose Model}
     * 
     * @public
     * 
     * @memberof Ms
     */
    getModel(resourceName) {
        return this.resources[resourceName].instance.model;
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

module.exports = {
    Ms: Ms,
    subscribe: Controller.subscribe
};