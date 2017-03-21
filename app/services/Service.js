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
     * @public
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    all() {        
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
        return this.repository.createResource(resource)
    }

    /**
     * Update single resource
     * 
     * @param {String} id
     * @param {Object} data
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Service
     */
    update(id, data) {
        return this.repository.updateResource(id, data);
    }
}

module.exports = Service;