'use strict';

const Rx         = require('rx');
const Repository = require('./Repository.js');
const Gateway    = require('./Gateway.js');

/**
 * 
 * 
 * @class Service
 */
class Service {

    /**
     * Creates an instance of Service.
     * 
     * @public
     * 
     * @memberof Service
     */
    constructor() {
        this.repository = new Repository();
        this.gateway    = new Gateway();
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
     * @memberof Service
     */
    all(model, query = {}) {
        let pagination = this._getPagination(query);

        return this.repository.getResources(model, query, pagination)
            .flatMap(
                data => this.gateway.getDocsResources(model, data.docs),
                (data, docs) => {
                    return Object.assign(data, { docs: docs });
                }
            )
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
     * @memberof Service
     */
    one(model, id) {
        return this.repository.getResource(model, id)
            .map(doc => doc.toObject())
            .flatMap(doc => this.gateway.getDocResources(model, doc))
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
     * @memberof Service
     */
    create(model, data) {
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
     * @memberof Service
     */
    update(model, id, data) {
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
     * @memberof Service
     */
    remove(model, id) {
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
     * @memberof Service
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

module.exports = Service;