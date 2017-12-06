'use strict';

const Rx = require('rx');
const rp = require('request-promise');

/**
 * It handles the connection to the corresponding microsevice
 * 
 * @class Gateway
 */
class Gateway {

    /**
     * Call the correct microservice to get a single resource
     * 
     * @param {String} ednpoint
     * @param {String} id
     * 
     * @static 
     * 
     * @returns {Observable}
     * 
     * @memberOf Gateway
     */
    static getRemoteResource(endpoint, id) {
        return Rx.Observable.create(obs => {
            rp({
                method: 'get',
                uri: endpoint + id,
                json: true
            })
            .then(response => {
                // extends data with the service response
                obs.onNext(Object.assign({}, response.data));

                obs.onCompleted();

                return null;
            })
            .catch(error => {
                console.log(error);

                obs.onNext(Object.assign({}));
                obs.onCompleted();
            });
        });
    }

    /**
     * Call the correct microservice to get multiple resources
     * 
     * @param {String} endpoint
     * @param {String[]} ids
     * 
     * @static
     *
     * @returns {Observable}
     * 
     * @memberOf Gateway
     */
    static getRemoteResources(endpoint, ids) {
        return Rx.Observable.from(ids).flatMap(id => {
            return Gateway.getRemoteResource(endpoint, id);
        })
        .toArray()
        .reduce((acc, item) => {
            return acc.concat(item);
        });
    }
}

module.exports = Gateway;