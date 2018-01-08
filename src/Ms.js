'use strict';

const Rx           = require('rx');
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const helmet       = require('helmet');
const compression  = require('compression');
const EventEmitter = require('events');
const Resource     = require('./Resource.js');
const Router       = require('./Router.js');
const Controller   = require('./Controller.js');

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
     * @param {Array} routes
     * 
     * @memberof Ms
     */
    constructor(mongo = {}, resources = {}, routes = []) {
        super();

        this.express   = express();
        this.mongo     = mongo;
        this.resources = resources;
        this.routes    = routes;

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
            
            // resource instance creation 
            resource.instance = new Resource(resourceName, resource.properties, resource.transformer);

            // resource custom routes registration
            if (resource.routes && resource.routes.length) {
                resource.routes.forEach(route => this._registerCustomRoute(route, resource));
            }

            // default crud routes registration
            this.express.use('/' + resourceName.toLowerCase(), Router);

        }, this);

        /**
         * Custom routes
         * 
         */        
        this.routes.forEach(route => {
            if(route.path == '/healthcheck') {
                console.log('/healthcheck is a reserved endpoint');
            }
            else {
                this._registerCustomRoute(route);
            }
        }, this);

        /**
         * Health check route
         * 
         */
        this.express.get('/healthcheck', [
            (req, res, next) => {
                req.source = Rx.Observable.of({ status: 'ok' });

                next();
            },

            Controller.subscribe
        ]);
    }

    /**
     * 
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     * 
     * @private
     * 
     * @memberof Ms
     */
    _emptyMiddleware(req, res, next) {
        req.source = Rx.Observable.of({});

        next();
    }

    /**
     * custom routes registration
     * 
     * @param {Object} route 
     * @param {Resource} resource 
     * 
     * @private
     * 
     * @memberof Ms
     */
    _registerCustomRoute(route, resource) {
        const method = route.method ? route.method.toLowerCase() : 'get';
        const path = (resource ? '/' + resource.instance.name.toLowerCase() : '') + route.path;

        this.express[method](path, [
            // prepend resource middleware
            (resource && resource.middleware ? resource.middleware : this._emptyMiddleware),

            // prepend route middleware
            (route.middleware ? route.middleware : this._emptyMiddleware),

            // append the custom event name to the req object
            (req, res, next) => {
                if(route.event) 
                    req.event = route.event;

                next();
            },

            // handler
            route.handler ? route.handler : this._emptyMiddleware, 

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
        const resource = req.app.get('ms').resources[req.path.substring(1).split('/')[0]];
        
        if(resource)
            req.resource = resource.instance;

        next();
    }

    /**
     * It returns the resource by name
     * 
     * @param {String} resourceName 
     * 
     * @returns {Resource}
     * 
     * @public
     * 
     * @memberof Ms
     */
    getResource(resourceName) {
        return this.resources[resourceName].instance;
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
        this.express.listen(port, () => {
            console.log('Application started');
        });
    }

}

module.exports = Ms;