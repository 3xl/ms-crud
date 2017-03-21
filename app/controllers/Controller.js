'use strict';

const Rx      = require('rx');
const Service = require('../services/Service.js');

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
     * @param {any} next
     * 
     * @memberOf Controller
     */
    static all(req, res, next) {
        let source = service.all();

        Controller.subscribe(source, res);
    }

    /**
     * Get single resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * 
     * @memberOf Controller
     */
    static one(req, res, next) {        
        let source = service.one(req.params.id);

        Controller.subscribe(source, res);
    }

    /**
     * Create one resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * 
     * @memberOf Controller
     */
    static create(req, res, next) {
        let source = service.create(req.body);

        Controller.subscribe(source, res);
    }

    /**
     * Update single resource
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * 
     * @memberOf Controller
     */
    static update(req, res, next) {
        let source = service.update(req.params.id, req.body);

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
            error => res.json(error)
        );
    }
}

module.exports = Controller;