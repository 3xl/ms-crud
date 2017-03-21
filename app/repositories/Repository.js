'use strict';

const model = require('../models/Model.js');
const Rx    = require('rx');

/**
 * 
 * 
 * @class Repository
 */
class Repository {

    /**
     * Creates an instance of Repository.
     * 
     * @memberOf Repository
     */
    constructor() {
        this.model = model('Resource');
    }

    /**
     * Get all resources from db
     * 
     * @returns
     * 
     * @memberOf Repository
     */
    getResources() {
        return Rx.Observable.fromPromise(this.model.find());
    }

    /**
     * Get on resource from db
     * 
     * @param {any} id
     * @returns
     * 
     * @memberOf Repository
     */
    getResource(id) {        
        return Rx.Observable.fromPromise(this.model.findOne({ _id: id }));
    }

    /**
     * Create a resource
     * 
     * @param {any} sonar
     * @returns
     * 
     * @memberOf Repository
     */
    createResource(resource) {
        return Rx.Observable.fromPromise(this.model.create(resource));
    }

    /**
     * Update a single resource
     * 
     * @param {String} id
     * @param {Objact} data
     * @returns
     * 
     * @memberOf Repository
     */
    update(id, data) {
        return Rx.Observable.fromPromise(this.model.update({ _id: id }, data));
    }
}

module.exports = Repository;