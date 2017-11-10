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
     * @public
     * 
     * @memberof Repository
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
     * @memberof Repository
     */
    getResources(model, query = {}, pagination = {}) {
        query = this.mongoqs.parse(query);

        return Rx.Observable.create(observer => {
            model.mongooseModel.paginate(query, pagination, (error, results) => {
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
     * @param {Model} model
     * @param {any} id
     * 
     * @public
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof Repository
     */
    getResource(model, id) {        
        return Rx.Observable.fromPromise(model.mongooseModel.findOne({ _id: id }));
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
     * @memberof Repository
     */
    createResource(model, data) {
        return Rx.Observable.fromPromise(model.mongooseModel.create(data));
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
     * @memberof Repository
     */
    updateResource(model, id, data) {
        return Rx.Observable.fromPromise(model.mongooseModel.update({ _id: id }, data));
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
     * @memberof Repository
     */
    removeResource(model, id) {
        return Rx.Observable.fromPromise(model.mongooseModel.delete({ _id: id }));
    }
}

module.exports = Repository;