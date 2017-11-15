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
     * 
     * @static
     * 
     * @memberof Controller
     */
    static all(req, res) {
        let source = req.resource.service.all(req.query);

        Controller.subscribe(source, res, req.app.get('ms'), 'GetAllResources');
    }

    /**
     * Get a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof Controller
     */
    static one(req, res) {        
        let source = req.resource.service.one(req.params.id);

        Controller.subscribe(source, res, req.app.get('ms'), 'GetOneResource');
    }

    /**
     * Create one resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof Controller
     */
    static create(req, res) {
        let source = req.resource.service.create(req.body);

        Controller.subscribe(source, res, req.app.get('ms'), 'CreateOneResource');
    }

    /**
     * Update a resource
     * 
     * @param {Object} req
     * @param {Object} res
     * 
     * @static
     * 
     * @memberof Controller
     */
    static update(req, res) {
        let source = req.resource.service.update(req.params.id, req.body);

        Controller.subscribe(source, res, req.app.get('ms'), 'UpdateOneResource');
    }

    /**
     * Remove a resource
     * 
     * @param {Object} req 
     * @param {Object} res 
     * 
     * @static
     * 
     * @memberof Controller
     */
    static remove(req, res) {
        let source = req.resource.service.remove(req.params.id);

        Controller.subscribe(source, res, req.app.get('ms'), 'ReomveOneResource');
    }

    /**
     * It handle all the Controller subscriptions
     * 
     * @param {Rx.Observalbe} source 
     * @param {Object} res 
     * @param {Object} ms 
     * @param {String} eventName 
     * 
     * @static
     * 
     * @memberof Controller
     */
    static subscribe(source, res, ms, eventName) {
        source.subscribe(
            response => {
                // emits the event corresponding to http action
                ms.emit(eventName, response);

                // send response
                return res.json({ data: response })
            },
            error => {
                // emits error event
                ms.emit('Error');

                // send response
                return res.json({
                    data: null,
                    error: error
                })
            }
        );
    }
}

module.exports = Controller;