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
     * @public
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
     * @returns {Rx.Observable}
     * 
     * @memberof BaseService
     */
    all(model, query = {}) {
        if(typeof query !== 'object') {
            return Rx.Observable.throwError();
        }

        let pagination = this._getPagination(query);

        return this.repository.getResources(model, query, pagination);
    }

    /**
     * Get single resource
     * 
     * @param {String} id
     * 
     * @public
     * 
     * @returns {Rx.Observable}
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
     * @public
     * 
     * @returns {Rx.Observable}
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
     * @public
     * 
     * @returns {Rx.Observable}
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
     * 
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof BaseService
     */
    remove(model, id) {
        if(typeof id !== 'string') {
            return Rx.Observable.throwError();
        }

        return this.repository.removeResource(model, id);
    }

    /**
     * Extract properties from the query string object and build a correct
     * pagination object. According to the mongoose-paginate package the main 
     * properties used to handle the pagination are:
     * 1. limit
     * 2. offset
     * 3. page
     * 
     * @param {Object} query 
     * 
     * @private
     * 
     * @returns {Object}
     * 
     * @memberof BaseService
     */
    _getPagination(query) {
        let pagination = {};

        if(query.hasOwnProperty('limit')) {
            pagination.limit = parseInt(query.limit);

            delete query.limit;
        }
        
        if(query.hasOwnProperty('offset')) {
            pagination.offset = parseInt(query.offset);

            delete query.offset;
        }
        
        if(query.hasOwnProperty('page')) {
            pagination.page = parseInt(query.page);

            delete query.page;
        }

        return pagination;
    }
}

module.exports = BaseService;