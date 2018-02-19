'use strict';

const Rx      = require('rx');
const MongoQS = require('mongo-querystring');

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
        return Rx.Observable.fromPromise(this.model.findOneAndUpdate({ _id: id }, data, { new: true }));
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

    /**
     * Restore a resource
     *
     * @param {String} id 
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    restoreResource(id) {
        return Rx.Observable.fromPromise(this.model.restore({ _id: id }));
    }

    /**
     * Find a document using the 'query' criteria or create a new document
     * 
     * @param {any} query 
     * @param {any} data 
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    findOrCreate(query, data) {
        return this.getResources(query)
            .concatMap(resources => {
                return Rx.Observable.if(
                    // check
                    () => resources.docs.length > 0,

                    // get the found resource
                    Rx.Observable.from(resources.docs)
                        .take(1),

                    // create a new user
                    Rx.Observable.of(data)
                        .concatMap(data => this.createResource(data))
                )
            });
    }

    /**
     * Update a document using the 'query' criteria or create a new document
     * 
     * @param {any} query 
     * @param {any} updateData 
     * @param {any} createData 
     * 
     * @public
     * 
     * @returns {Observable}
     * 
     * @memberof Repository
     */
    updateOrCreate(query, updateData, createData) {
        return this.getResources(query)
            .concatMap(resources => {
                return Rx.Observable.if(
                    // check
                    () => resources.docs.length > 0,

                    // get the found resource
                    Rx.Observable.from(resources.docs)
                        .take(1)
                        .concatMap(resource => this.updateResource(resource._id, updateData)),

                    // create a new user
                    Rx.Observable.of(createData)
                        .concatMap(createData => this.createResource(createData))
                )
            });
    }
}

module.exports = Repository;