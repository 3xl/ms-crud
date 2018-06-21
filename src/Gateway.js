'use strict';

const Rx    = require('rx');
const rp    = require('request-promise');
const Utils = require('./Utils.js');

/**
 * It handles the connection to the corresponding microsevice
 * 
 * @class Gateway
 */
class Gateway {
    
    /**
     * Send form data to url
     * 
     */
    static sendForm(endpoint, data) {
        return Rx.Observable.create(obs => {
            rp({
                method: 'POST',
                url: endpoint,
                formData: data,
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => {
                // extends data with the service response
                obs.onNext(Object.assign({}, response));
                obs.onCompleted();

                return null;
            })
            .catch(error => {
                obs.onNext(Object.assign({}, { error: error }));
                obs.onCompleted();
            });
        });
    }
    
    /**
     * Call a generic endpoint
     * 
     * @param {any} endpoint 
     * @param {string} [method='get'] 
     * 
     * @static
     * 
     * @returns 
     * 
     * @memberof Gateway
     */
    static call(endpoint, method = 'get') {
        return Rx.Observable.create(obs => {
            rp({
                method: method,
                uri: endpoint,
                json: true
            })
            .then(response => {
                // extends data with the service response
                obs.onNext(Object.assign({}, response));
                obs.onCompleted();

                return null;
            })
            .catch(error => {
                obs.onNext(Object.assign({}, { error: error }));
                obs.onCompleted();
            });
        });
    }

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
                obs.onNext(Object.assign({}, { error: error }));
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
        return Rx.Observable.from(ids).concatMap(id => {
            return Gateway.getRemoteResource(endpoint, id);
        })
        .reduce((acc, item) => {
            return Utils.Object.isEmpty(item) ? acc : acc.concat(item);
        }, []);
    }
}

module.exports = Gateway;