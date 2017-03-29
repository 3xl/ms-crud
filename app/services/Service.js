'use strict';

const Rx         = require('rx');
const Repository = require('../repositories/Repository.js');

/**
 * 
 * 
 * @class Service
 */
class Service {

    /**
     * Creates an instance of Service.
     * 
     * @memberOf Service
     */
    constructor() {
        this.repository = new Repository();
    }
    
    /**
     * Get all resources
     * 
     * @param {Object} query
     * 
     * @public
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    all(query = {}) {
        if(typeof query !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.getResources();
    }

    /**
     * Get single resource
     * 
     * @param {String} id
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    one(id) {
        if(typeof id !== 'string') {
            return Rx.Observable.throwError();
        }

        return this.repository.getResource(id);
    }

    /**
     * Create one resource
     * 
     * @param {Object} resource
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    create(resource) {
        if(typeof resource !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.createResource(resource)
    }

    /**
     * Update a resource
     * 
     * @param {String} id
     * @param {Object} data
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    update(id, data) {
        if(typeof id !== 'string' && typeof data !== 'object') {
            return Rx.Observable.throwError();
        }

        return this.repository.updateResource(id, data);
    }

    /**
     * Remove a resource
     * 
     * @param {String} id 
     * @returns 
     * 
     * @memberOf Service
     */
    remove(id) {
        if(typeof id !== 'string') {
            return Rx.Observable.throwError();
        }

        return this.repository.removeResource(id);
    }
}

module.exports = Service;