'use strict';

const Service = require('../../services/Service.js');

const service = new Service(); 

/**
 * 
 * 
 * @class Controller
 */
class Controller {

    /**
     * Get all resources
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * 
     * @memberOf Controller
     */
    static all(req, res) {
        let source = service.all(req.query);

        Controller.subscribe(source, res);
    }

    /**
     * Get a resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * 
     * @memberOf Controller
     */
    static one(req, res) {        
        let source = service.one(req.params.id);

        Controller.subscribe(source, res);
    }

    /**
     * Create one resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * 
     * @memberOf Controller
     */
    static create(req, res) {
        let source = service.create(req.body);

        Controller.subscribe(source, res);
    }

    /**
     * Update a resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * 
     * @memberOf Controller
     */
    static update(req, res) {
        let source = service.update(req.params.id, req.body);

        Controller.subscribe(source, res);
    }

    /**
     * Remove a resource
     * 
     * @static
     * @param {any} req 
     * @param {any} res 
     * 
     * @memberOf Controller
     */
    static remove(req, res) {
        let source = service.remove(req.params.id);

        Controller.subscribe(source, res);
    }

    /**
     * It handle all the Controller subscriptions
     * 
     * @static
     * @param {Rx.Observalbe} source 
     * @param {Response} res 
     * 
     * @memberOf Controller
     */
    static subscribe(source, res) {
        source.subscribe(
            response => res.json({ data: response }),
            error => res.json({ 
                data: null, 
                error: error 
            })
        );
    }
}

module.exports = Controller;