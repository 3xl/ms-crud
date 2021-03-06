'use strict';

const Rx = require('rx');

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
    req.source = req.source
      // apply filters extending req.query object
      .flatMap(() => Rx.Observable.of(Object.assign({}, req.query, req.filters)))
      .flatMap(query => req.resource.service.all(query));

    req.event = 'GetAll' + req.resource.name;

    next();
  }

  /**
   * Get the first resource
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @static
   * 
   * @memberof Controller
   */
  static first(req, res, next) {
    req.source = req.source
      // apply filters extending req.query object
      .flatMap(() => Rx.Observable.of(Object.assign({}, req.query, req.filters)))
      .flatMap(query => req.resource.service.first(query));

    req.event = 'GetOne' + req.resource.name;

    next()
  }

  /**
   * Get the latest resource
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @static
   * 
   * @memberof Controller
   */
  static latest(req, res, next) {
    req.source = req.source
      // apply filters extending req.query object
      .flatMap(() => Rx.Observable.of(Object.assign({}, req.query, req.filters)))
      .flatMap(query => req.resource.service.latest(query));

    req.event = 'GetOne' + req.resource.name;

    next()
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
    req.source = req.source
      .flatMap(req.resource.service.one(req.params.id));

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
    req.source = req.source
      // apply data extending req.body object
      .flatMap(() => Rx.Observable.of(Object.assign({}, req.body, req.data)))
      .flatMap(body => req.resource.service.create(body));

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
    req.source = req.source
      // apply data extending req.body object
      .flatMap(() => Rx.Observable.of(Object.assign({}, req.body, req.data)))
      .flatMap(body => req.resource.service.update(req.params.id, body));

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
    req.source = req.source
      .flatMap(req.resource.service.remove(req.params.id));

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
    req.source = req.source
      .flatMap(req.resource.service.restore(req.params.id));

    req.event = 'RestoreOne' + req.resource.name;

    next()
  }

  /**
   * Find a resource or create a new one
   * 
   * @param {Object} req 
   * @param {Object} res
   * @param {Function} next
   * 
   * @static
   * 
   * @memberof Controller
   */
  static findOrCreate(req, res, next) {
    req.source = req.source
      .flatMap(req.resource.service.findOrCreate(
          req.body.query, 
          req.body.data
        )
      );

    next()
  }

  /**
   * Update a resource or create a new one
   * 
   * @param {Object} req 
   * @param {Object} res
   * @param {Function} next
   * 
   * @static
   * 
   * @memberof Controller
   */
  static updateOrCreate(req, res, next) {
    req.source = req.source
      .flatMap(req.resource.service.updateOrCreate(
          req.body.query, 
          req.body.updateData, 
          req.body.createData
        )
      );

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
        if (req.event)
          eventEmitter.emit(req.event, req.resource, response, eventEmitter);

        // send response
        return res.json({ data: response })
      },
      error => {
        // emits error event
        eventEmitter.emit('Error', error);

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