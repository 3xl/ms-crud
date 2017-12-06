'use strict';

/**
 * 
 * 
 * @class Controller
 */
class Controller {

    /**
     * Get all resources
     * 
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static all(req, res, next) {
        req.source = req.resource.service.all(req.query);
        req.event = 'GetAll' + req.resource.name;

        next();
    }

    /**
     * Get a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static one(req, res, next) {        
        req.source = req.resource.service.one(req.params.id);
        req.event = 'GetOne' + req.resource.name;

        next()
    }

    /**
     * Create one resource
     * 
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static create(req, res, next) {
        req.source = req.resource.service.create(req.body);
        req.event = 'CreateOne' + req.resource.name;

        next()
    }

    /**
     * Update a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static update(req, res, next) {
        req.source = req.resource.service.update(req.params.id, req.body);
        req.event = 'UpdateOne' + req.resource.name;

        next()
    }

    /**
     * Remove a resource
     * 
     * @param {Object} req 
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static remove(req, res, next) {
        req.source = req.resource.service.remove(req.params.id);
        req.event = 'RemoveOne' + req.resource.name;

        next()
    }

    /**
     * Restrore a resource
     * 
     * @param {Object} req 
     * @param {Object} res
     * @param {Function} next
     * 
     * @static
     * 
     * @memberof Controller
     */
    static restore(req, res, next) {
        req.source = req.resource.service.restore(req.params.id);
        req.event = 'RestoreOne' + req.resource.name;

        next()
    }

    /**
     * It handle all the Controller subscriptions
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     * 
     * @static
     * 
     * @memberof Controller
     */
    static subscribe(req, res, next) {
        const eventEmitter = req.app.get('ms');

        req.source.subscribe(
            response => {
                // emits the event corresponding to http action
                eventEmitter.emit(req.event, req.resource, response);

                // send response
                return res.json({ data: response })
            },
            error => {
                // emits error event
                eventEmitter.emit('Error');

                // send response
                return res.status(404).json({
                    data: null,
                    error: error
                })
            }
        );
    }
}

module.exports = Controller;