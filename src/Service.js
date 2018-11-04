'use strict';

const Repository = require('./Repository.js');
const Rx = require('rx');

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
    this.resource = resource;
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
      .concatMap(
        data => {
          return Rx.Observable.from(data.docs)
            .concatMap(doc => this._populateAndTransform(doc))
            .toArray();
        },
        (data, docs) => {
          return Object.assign(data, { docs: docs });
        }
      )
  }

  /**
   * Get the first resource
   * 
   * @public
   * 
   * @returns {Observable}
   * 
   * @memberof Service
   */
  first() {
    return this.repository.getResources({}, { sort: { createdAt: 1 }, limit: 1 })
      .concatMap(data => {
        return Rx.Observable.if(
          // check
          () => data.docs.length > 0,

          // get the first and only element in the array
          Rx.Observable.from(data.docs).take(1),

          // return an empty object
          Rx.Observable.of({})
        )
      })
      .concatMap(doc => this._populateAndTransform(doc))
  }

  /**
   * Get the latest resource
   * 
   * @public
   * 
   * @returns {Observable}
   * 
   * @memberof Service
   */
  latest() {
    return this.repository.getResources({}, { sort: { createdAt: -1 }, limit: 1 })
      .concatMap(data => {
        return Rx.Observable.if(
          // check
          () => data.docs.length > 0,

          // get the first and only element in the array
          Rx.Observable.from(data.docs).take(1),

          // return an empty object
          Rx.Observable.of({})
        )
      })
      .concatMap(doc => this._populateAndTransform(doc))
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
      .concatMap(doc => this._populateAndTransform(doc))
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
      .concatMap(doc => this._populateAndTransform(doc));
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
      .concatMap(doc => this._populateAndTransform(doc))
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
   * Restore a resource
   * 
   * @param {String} id 
   * 
   * @public
   * 
   * @returns {Observable}
   * 
   * @memberof Service
   */
  restore(id) {
    return this.repository.restoreResource(id);
  }

  /**
   * Find a resourse using a different query criteria and update it
   * 
   * @param {Object} query
   * @param {Object} data
   * 
   * @public
   * 
   * @returns {Observable}
   * 
   * @memberof Service
   */
  findAndUpdate(query, data) {
    return this.repository.findAndUpdate(query, data);
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
   * @memberof Service
   */
  findOrCreate(query, data) {
    return this.repository.findOrCreate(query, data)
      .concatMap(doc => this._populateAndTransform(doc));
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
   * @memberof Service
   */
  updateOrCreate(query, updateData, createData) {
    return this.repository.updateOrCreate(query, updateData, createData)
      .concatMap(doc => this._populateAndTransform(doc));
  }

  /**
   * 
   * 
   * @param {Object} doc 
   * 
   * @private
   * 
   * @returns {Observable}
   * 
   * @memberof Service
   */
  _populateAndTransform(doc) {
    return Rx.Observable.of(doc)
      .map(doc => doc.toObject())
      .concatMap(doc => this.resource.appendRemoteResource(doc))
      .concatMap(doc => this.resource.transform(doc))
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
    let pagination = { paginated: 1 };

    if (query.hasOwnProperty('paginated')) {
      pagination.paginated = parseInt(query.paginated);

      delete query.paginated;
    }

    if (query.hasOwnProperty('limit')) {
      pagination.limit = parseInt(query.limit);

      delete query.limit;
    }

    if (query.hasOwnProperty('offset')) {
      pagination.offset = parseInt(query.offset);

      delete query.offset;
    }

    if (query.hasOwnProperty('page')) {
      pagination.page = parseInt(query.page);

      delete query.page;
    }

    if (query.hasOwnProperty('sort')) {
      pagination.sort = JSON.parse(query.sort);

      delete query.sort;
    }

    return pagination;
  }
}

module.exports = Service;