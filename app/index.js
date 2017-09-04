'use strict';

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const RxFs       = require('./commons/RxFs.js');
const Rx         = require('Rx');

/**
 * 
 * 
 * @class App
 */
class App {
    
    /**
     * Creates an instance of App.
     * 
     * @param {String} database 
     * @param {String} user 
     * @param {String} password 
     * 
     * @memberOf App
     */
    constructor(database, user, password, log = 0) {
        this.express  = express();        
        this.database = database;
        this.user     = user;
        this.password = password;
        this.log      = log;

        this._config();
    }

    /**
     * Configure express middlewares
     * 
     * @private
     * 
     * @memberOf App
     */
    _config() {
        this.express.use(bodyParser.json());

        /**
         * Mongo connection
         * 
         */
        mongoose.connect(this.database, {
            user: this.user, 
            pass: this.password
        });

        /**
         * Logs
         * 
         */
        if(this.log == 1) {            
            this.express.use(require('morgan')('combined'));
        }

        /**
         * Resources
         * 
         */
        let resources = require('./resources.js');

        // 1. Models
        this.express.set('models', resources.models);

        // 2. Routes

        // Extract the model name from the baseUrl property of the request
        this.express.use((req, res, next) => {
            let models = this.express.get('models')

            req.model = models[req.url.substring(1).split('/')[0]];

            next();
        })

        resources.routes.forEach((route) => {
            this.express.use(route[0], route[1]);
        });
    }

    /**
     * Extends express funcionalities adding new middleware
     * 
     * @param {any} - module
     * 
     * @public
     * 
     * @memberOf App
     */
    add(module) {
        this.express.use(module);
    }

    /**
     * Start application
     * 
     * @param {Number} - port
     * 
     * @public
     * 
     * @memberOf App
     */
    start(port) {
        this.express.set('port', port);

        this.express.listen(port, () => {
            console.log('Application started');
        });
    }

}

module.exports = App;