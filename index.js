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
        this.resources = resources;
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
            let resource = this.resources[resourceName];
            
            // resources instance creation 
            resource.instance = new Resource(resourceName, resource.properties);

            // default crud routes registration
            this.express.use('/' + resourceName.toLowerCase(), Router);

            // custom routes registration
            if (resource.routes && resource.routes.length) {                
                resource.routes.forEach(route => this._registerCustomRoute(resource, route), this);
            }

        }, this);
    }

    /**
     * custom routes registration
     * 
     * @param {Object} route 
     * 
     * @private
     * 
     * @memberof Ms
     */
    _registerCustomRoute(resource, route) {
        const method = route.method ? route.method.toLowerCase() : 'get';
        const path = '/' + resource.instance.name.toLowerCase() + route.path;

        this.express[method](path, [
            // append the custom event name to the req object
            (req, res, next) => {
                req.event = route.event;

                next();
            },

            // handler
            route.handler, 

            // observable subscription
            Controller.subscribe
        ]);
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
        const resources = req.app.get('ms').resources;

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

module.exports = Ms;