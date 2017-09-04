'use strict';

const Rx = require('rx');

/**
 * 
 * 
 * @class BaseRepository
 */
class BaseRepository {

    /**
     * Creates an instance of BaseRepository.
     * 
     * @memberof BaseRepository
     */
    constructor() {}

    /**
     * Get all resources from db
     * 
     * @param {String} model
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseRepository
     */
    getResources(model) {
        return Rx.Observable.fromPromise(model.find());
    }

    /**
     * Get a resource from db
     * 
     * @param {String} model
     * @param {any} id
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseRepository
     */
    getResource(model, id) {        
        return Rx.Observable.fromPromise(model.findOne({ _id: id }));
    }

    /**
     * Create a resource
     * 
     * @param {String} model
     * @param {Object} data
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseRepository
     */
    createResource(model, data) {
        return Rx.Observable.fromPromise(model.create(data));
    }

    /**
     * Update a resource
     * 
     * @param {String} model
     * @param {String} id
     * @param {Objact} data
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseRepository
     */
    updateResource(model, id, data) {
        return Rx.Observable.fromPromise(model.update({ _id: id }, data));
    }

    /**
     * Remove a resource
     * 
     * @param {String} id 
     * 
     * @returns Rx.Observable
     * 
     * @memberof BaseRepository
     */
    removeResource(model, id) {
        return Rx.Observable.fromPromise(model.find({ _id: id}).remove());
    }
}

module.exports = BaseRepository;