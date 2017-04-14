'use strict';

const Rx    = require('rx');
const Model = require('../models/Model.js');

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
    constructor(model) {
        this.model = model || Model();
    }

    /**
     * Get all resources from db
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Repository
     */
    getResources() {
        return Rx.Observable.fromPromise(this.model.find());
    }

    /**
     * Get a resource from db
     * 
     * @param {any} id
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Repository
     */
    getResource(id) {        
        return Rx.Observable.fromPromise(this.model.findOne({ _id: id }));
    }

    /**
     * Create a resource
     * 
     * @param {Object} resource
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Repository
     */
    createResource(resource) {
        return Rx.Observable.fromPromise(this.model.create(resource));
    }

    /**
     * Update a resource
     * 
     * @param {String} id
     * @param {Objact} data
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Repository
     */
    updateResource(id, data) {
        return Rx.Observable.fromPromise(this.model.update({ _id: id }, data));
    }

    /**
     * Remove a resource
     * 
     * @param {String} id 
     * 
     * @returns Rx.Observable
     * 
     * @memberOf Repository
     */
    removeResource(id) {
        return Rx.Observable.fromPromise(this.model.find({ _id: id}).remove());
    }
}

module.exports = Repository;