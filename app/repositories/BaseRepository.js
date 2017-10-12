'use strict';

const Rx      = require('rx');
const MongoQS = require('mongo-querystring');
const Utils   = require('../utils/Utils.js');

/**
 * 
 * 
 * @class BaseRepository
 */
class BaseRepository {

    /**
     * Creates an instance of BaseRepository.
     * 
     * @public
     * 
     * @memberof BaseRepository
     */
    constructor() {
        this.mongoqs = new MongoQS(); 
    }

    /**
     * Get all resources from db
     * 
     * @param {Model} model
     * @param {Object} query
     * @param {Object} pagination
     * 
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof BaseRepository
     */
    getResources(model, query = {}, pagination = {}) {
        query = this.mongoqs.parse(query);

        if(Utils.Object.isEmpty(pagination)) {
            return Rx.Observable.fromPromise(model.find(query));
        } else {
            return Rx.Observable.create(observer => {
                model.paginate(query, pagination, (error, results) => {
                    if(error) {
                        observer.onError(error);
                    }
    
                    observer.onNext(results);
                    observer.onCompleted();
                });
            });
        }
    }

    /**
     * Get a resource from db
     * 
     * @param {Model} model
     * @param {any} id
     * 
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof BaseRepository
     */
    getResource(model, id) {        
        return Rx.Observable.fromPromise(model.findOne({ _id: id }));
    }

    /**
     * Create a resource
     * 
     * @param {Model} model
     * @param {Object} data
     * 
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof BaseRepository
     */
    createResource(model, data) {
        return Rx.Observable.fromPromise(model.create(data));
    }

    /**
     * Update a resource
     * 
     * @param {Model} model
     * @param {String} id
     * @param {Objact} data
     * 
     * @public
     * 
     * @returns {Rx.Observable}
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
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof BaseRepository
     */
    removeResource(model, id) {
        return Rx.Observable.fromPromise(model.find({ _id: id}).remove());
    }
}

module.exports = BaseRepository;