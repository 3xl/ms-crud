'use strict';

const Rx = require('rx');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const EventEmitter = require('events');
const Resource = require('./Resource.js');
const Router = require('./Router.js');
const Controller = require('./Controller.js');
const Utils = require('./Utils.js');

/**
 * Main Microservice class
 * 
 * @class Ms
 */
class Ms extends EventEmitter {

  /**
   * Creates an instance of Ms.
   * 
   * @param {Object} config
   * 
   * @memberof Ms
   */
  constructor(config = {}) {
    super();

    if (Utils.Object.isEmpty(config.mongo)) {
      throw new Error('mongo parameter connection is required.');
    }

    this.express = express();
    this.mongo = config.mongo;
    this.middlewares = config.middlewares || [];
    this.resources = config.resources || {};
    this.routes = config.routes || [];
    this.cors = config.cors || false

    /**
     * Mongo connection
     * 
     */
    mongoose.Promise = global.Promise;

    mongoose.connect(this.mongo.connection, {
      user: this.mongo.user,
      pass: this.mongo.password,
      useCreateIndex: true,
      useNewUrlParser: true
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
    if (this.cors) {
      this.express.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next();
      });
    }

    this.express.use(bodyParser.json());
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(require('morgan')('combined'));

    this.middlewares.forEach(middleware => {
      this.express.use(middleware);
    });

    this.express.use(this._selecteResource);

    /**
     * Routes and Models
     * 
     */
    Object.keys(this.resources).forEach(resourceName => {
      let resource = this.resources[resourceName];

      // resource instance creation 
      resource.instance = new Resource(resourceName, resource.properties, resource.transformer, resource.populate);

      // default crud routes registration
      if(resource.middlewares) {
        this.express.use('/' + resourceName.toLowerCase(), [this._emptyMiddleware, ...(resource.middlewares), Router]);
      } else {
        this.express.use('/' + resourceName.toLowerCase(), [this._emptyMiddleware, Router]);
      }

      // resource custom routes registration
      if (resource.routes && resource.routes.length) {
        resource.routes.forEach(route => this._registerCustomRoute(route, resource));
      }

    }, this);

    /**
     * Custom routes
     * 
     */
    this.routes.forEach(route => {
      if (route.path == '/healthcheck') {
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
   * Useful to handle default behavior
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
      this._emptyMiddleware,

      // prepend resource middleware
      resource && resource.middlewares ? [...resource.middlewares] : [],

      // prepend route middleware
      route.middlewares ? [...route.middlewares] : [],

      // append the custom event name to the req object
      (req, res, next) => {
        if (route.event)
          req.event = route.event;

        next();
      },

      // handler
      route.handler ? route.handler : [],

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

    if (resource)
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