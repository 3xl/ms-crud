'use strict';

const Repository = require('./Repository.js');
const Gateway    = require('./Gateway.js');
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
        this.gateway    = new Gateway();
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

            // get linked remote resources
            .concatMap(
                data => this.gateway.getDocsResources(this.resource.properties, data.docs),
                (data, docs) => {
                    return Object.assign(data, { docs: docs });
                }
            )

            // apply transformer
            .concatMap(
                data => this._transformDocs(data.docs),
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
            // .map(doc => doc.toObject())
            
            // get linked remote resources
            .flatMap(doc => this.gateway.getDocResources(this.resource.properties, doc))

            // apply transformer
            .flatMap(doc => this._transformDoc(doc));
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
            
            // apply transformer
            .flatMap(doc => this._transformDoc(doc));
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
        return this.repository.updateResource(id, data)

            // apply transformer
            .flatMap(doc => this._transformDoc(doc));
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

    /**
     * It returns the collection of documents modified using
     * the user defined transfomer
     * 
     * @param {Array} docs 
     * 
     * @private
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    _transformDocs(docs) {
        return Rx.Observable.if(
            // check if the resourse has a transformer to be applied
            () => this.resource.transformer,

            // transform all the documents
            Rx.Observable.from(docs)
                .map(this.resource.transformer)
                .toArray(),

            // return the original docs
            Rx.Observable.of(docs)
        );
    }

    /**
     * It returns thedocument modified using
     * the user defined transfomer
     * 
     * @param {Object} doc
     * 
     * @private
     * 
     * @returns {Observable}
     * 
     * @memberof Service
     */
    _transformDoc(doc) {
        return Rx.Observable.if(
            // check if the resourse has a transformer to be applied
            () => this.resource.transformer,
            
            // transform the document
            Rx.Observable.of(doc)
                .map(this.resource.transformer),

            // return the original doc
            Rx.Observable.of(doc)
        );
    }
}

module.exports = Service;