'use strict';

const Rx      = require('rx');
const MongoQS = require('mongo-querystring');
const Utils   = require('./Utils.js');

/**
 * 
 * 
 * @class Repository
 */
class Repository {

    /**
     * Creates an instance of Repository.
     * 
     * @param {Mongoose Model} model
     * 
     * @public
     * 
     * @memberof Repository
     */
    constructor(model) {
        this.model = model;
        this.mongoqs = new MongoQS(); 
    }

    /**
     * Get all resources from db
     * 
     * @param {Object} query
     * @param {Object} pagination
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    getResources(query = {}, pagination = {}) {
        query = this.mongoqs.parse(query);

        return Rx.Observable.create(observer => {
            this.model.paginate(query, pagination, (error, results) => {
                if (error) {
                    observer.onError(error);
                }

                observer.onNext(results);
                observer.onCompleted();
            });
        });
    }

    /**
     * Get a resource from db
     * 
     * @param {any} id
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    getResource(id) {        
        return Rx.Observable.fromPromise(this.model.findOne({ _id: id }));
    }

    /**
     * Create a resource
     * 
     * @param {Object} data
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    createResource(data) {
        return Rx.Observable.fromPromise(this.model.create(data));
    }

    /**
     * Update a resource
     * 
     * @param {String} id
     * @param {Objact} data
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    updateResource(id, data) {
        return Rx.Observable.fromPromise(this.model.update({ _id: id }, data));
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
     * @memberof Repository
     */
    removeResource(id) {
        return Rx.Observable.fromPromise(this.model.delete({ _id: id }));
    }
}

module.exports = Repository;