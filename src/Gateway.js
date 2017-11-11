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
     * @public 
     * 
     * @returns {Rx.Observable}
     * 
     * @memberOf Gateway
     */
    getRemoteResource(endpoint, id) {
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
     * @public
     *
     * @returns {Rx.Observable}
     * 
     * @memberOf Gateway
     */
    getRemoteResources(endpoint, ids) {
        return Rx.Observable.from(ids).flatMap(id => {
            return this.getResourceStream(endpoint, id);
        })
        .toArray()
        .reduce((acc, item) => {
            return acc.concat(item);
        });
    }

    /**
     * It walk through all the document properties and get the data model from another microservice
     * 
     * @param {Object} model 
     * @param {Object} doc 
     * 
     * @public 
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof Gateway
     */
    getDocResources(model, doc) {
        return Rx.Observable.if(
            //
            () => this._checkRemoteProperties(model, doc),

            //
            this._getRemoteProperties(model, doc)
                .flatMap(
                    key => this.getRemoteResource(model.mongooseModel.schema.obj[key].endpoint, doc[key]),
                    (key, resource) => {
                        doc[key] = resource;

                        return doc;
                    }
                ),
            
            //
            Rx.Observable.of(doc)
        );
    }

    /**
     * For the documents list it walk through all the document properties and get the data model from another microservice
     * 
     * @param {Object} model 
     * @param {Object} doc 
     * 
     * @public 
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof Gateway
     */
    getDocsResources(model, docs) {
        return Rx.Observable.from(docs)
            .map(doc => doc.toObject())
            .flatMap(doc => this.getDocResources(model, doc))
            .toArray()
    }
    

    /**
     * It filters the document's properties containing a joint with another mocroservice
     * 
     * @param {Object} model 
     * @param {Object} doc 
     * 
     * @private
     * 
     * @returns {Rx.Observable}
     * 
     * @memberof Gateway
     */
    _getRemoteProperties(model, doc) {
        let mongooseModel = model.mongooseModel;

        return Rx.Observable.from(Object.keys(doc))
            .filter(key => mongooseModel.schema.obj[key] && mongooseModel.schema.obj[key].endpoint !== undefined);
    }

    /**
     * Check if the model has a property linked with another microservice
     * 
     * @param {Object} model 
     * @param {Object} doc 
     * 
     * @private
     * 
     * @returns {Boolean}
     * 
     * @memberof Gateway
     */
    _checkRemoteProperties(model, doc) {
        let obj   = model.mongooseModel.schema.obj;
        let value = false;

        Object.keys(obj).forEach(key => {
            if(obj[key].endpoint && doc[key])
                value = true;
        });

        return value;
    }
}

module.exports = Gateway;