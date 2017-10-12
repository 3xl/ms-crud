'use strict';

const BaseService = require('../../services/BaseService.js');

const service = new BaseService();

/**
 * 
 * 
 * @class BaseController
 */
class BaseController {

    /**
     * Get all resources
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof BaseController
     */
    static all(req, res) {
        let source = service.all(req.model, req.query);

        BaseController.subscribe(source, res);
    }

    /**
     * Get a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof BaseController
     */
    static one(req, res) {        
        let source = service.one(req.model, req.params.id);

        BaseController.subscribe(source, res);
    }

    /**
     * Create one resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof BaseController
     */
    static create(req, res) {
        let source = service.create(req.model, req.body);

        BaseController.subscribe(source, res);
    }

    /**
     * Update a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof BaseController
     */
    static update(req, res) {
        let source = service.update(req.model, req.params.id, req.body);

        BaseController.subscribe(source, res);
    }

    /**
     * Remove a resource
     * 
     * @param {Object} req 
     * @param {Object} res 
     * 
     * @static
     * 
     * @memberof BaseController
     */
    static remove(req, res) {
        let source = service.remove(req.model, req.params.id);

        BaseController.subscribe(source, res);
    }

    /**
     * It handle all the BaseController subscriptions
     * 
     * @param {Rx.Observalbe} source 
     * @param {Object} res 
     * 
     * @static
     * 
     * @memberof BaseController
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

module.exports = BaseController;