'use strict';

const Repository = require('./Repository.js');
const Rx         = require('rx');

/**
 * 
 * 
 * @class Service
 */
class Service {

    /**
     * Creates an instance of Service.
     * 
     * @param {Resource} resource
     * 
     * @public
     * 
     * @memberof Service
     */
    constructor(resource) {
        this.resource   = resource;
        this.repository = new Repository(this.resource.model);
    }
    
    /**
     * Get all resources
     * 
     * @param {Object} query
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    all(query = {}) {
        const pagination = this._getPagination(query);

        return this.repository.getResources(query, pagination)
            .flatMap(
                data => {
                    return Rx.Observable.from(data.docs)
                        .map(doc => doc.toObject())
                        .flatMap(doc => this.resource.appendRemoteResource(doc))
                        .toArray();
                },
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
     * @returns {Observable}
     * 
     * @memberof Service
     */
    one(id) {
        return this.repository.getResource(id)
            .map(doc => doc.toObject())
            .flatMap(doc => this.resource.appendRemoteResource(doc))
    }

    /**
     * Create one resource
     * 
     * @param {Object} data
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    create(data) {
        return this.repository.createResource(data)
    }

    /**
     * Update a resource
     * 
     * @param {String} id
     * @param {Object} data
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    update(id, data) {
        return this.repository.updateResource(id, data);
    }

    /**
     * Remove a resource
     * 
     * @param {String} id 
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    remove(id) {
        return this.repository.removeResource(id);
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