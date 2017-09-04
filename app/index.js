'use strict';

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const RxFs       = require('./commons/RxFs.js');
const Rx         = require('Rx');
const fs         = require('fs');
const path       = require('path');

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
        let resources = this._getResources();

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
     * Load all the models and create the corresponding routes
     * 
     * @private
     * 
     * @memberOf App
     */
    _getResources() {
        let basename     = path.basename(module.filename);
        let modelsFolder = __dirname + '/models';
        let routesFolder = __dirname + '/http/routes';

        let models = [];
        let routes = [];

        fs.readdirSync(modelsFolder)
            .filter((file) => {
                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            })
            .forEach((file) => {
                let modelModule = require(path.join(modelsFolder, file)),
                    model = file.slice(0, -3).toLowerCase(),
                    router = require(path.join(routesFolder, 'BaseRoutes.js')),
                    route = '/' + file.slice(0, -3);

                models[model] = modelModule;
                routes.push([route, router]);
            });

        return {
            models: models,
            routes: routes
        };
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