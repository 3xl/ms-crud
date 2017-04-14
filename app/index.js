'use strict';

const express    = require('express');
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
     * @memberOf App
     */
    constructor() {
        this.express = express();

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
         * Routes
         * 
         */
        let routes = require('./http/routes.js');

        routes.forEach((route) => {
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

    /**
     * Rename base resource endpoint
     * 
     * @param {String} - name
     * 
     * @static
     * 
     * @memberOf App
     */
    static rename(name) {
        if(name == '')
            return false;

        let folder = process.cwd() + '/app/http/routes/',
            newFile = folder + name + '.js';
        
        // get folder content
        RxFs.readdir(folder)

            // check the existance of the file. If there's not file throw an error
            .flatMap(files => {
                if(files.length > 1)
                    Rx.Observable.throw('This folder cannot contains more than one file.');

                return Rx.Observable.from(files);
            })

            // rename the only file of this folder
            .first(file => RxFs.rename(folder + file, newFile))

            // execute subscription
            .subscribe(
                response => console.log('The file ' + response + ' has been renamed in ' + newFile),
                error => console.log(error)
            );
    }

}

module.exports = App;