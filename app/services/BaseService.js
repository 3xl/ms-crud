'use strict';

const Rx             = require('rx');
const BaseRepository = require('../repositories/BaseRepository.js');

/**
 * 
 * 
 * @class BaseService
 */
class BaseService {

    /**
     * Creates an instance of BaseService.
     * 
     * @memberof BaseService
     */
    constructor() {
        this.repository = new BaseRepository();
    }
    
    /**
     * Get all resources
     * 
     * @param {Module} model
     * @param {Object} query
     * 
     * @public
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseService
     */
    all(model, query = {}) {
        if(typeof query !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.getResources(model);
    }

    /**
     * Get single resource
     * 
     * @param {String} id
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseService
     */
    one(model, id) {
        if(typeof id !== 'string') {
            return Rx.Observable.throwError();
        }

        return this.repository.getResource(model, id);
    }

    /**
     * Create one resource
     * 
     * @param {Object} model
     * @param {Object} data
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseService
     */
    create(model, data) {
        if(typeof data !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.createResource(model, data)
    }

    /**
     * Update a resource
     * 
     * @param {Module} model
     * @param {String} id
     * @param {Object} data
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseService
     */
    update(model, id, data) {
        if(typeof id !== 'string' && typeof data !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.updateResource(model, id, data);
    }

    /**
     * Remove a resource
     * 
     * @param {Module} model 
     * @param {String} id 
     * @returns 
     * 
     * @memberof BaseService
     */
    remove(model, id) {
        if(typeof id !== 'string') {
            return Rx.Observable.throwError();
        }

        return this.repository.removeResource(model, id);
    }
}

module.exports = BaseService;