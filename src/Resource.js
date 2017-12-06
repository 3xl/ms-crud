'use strict';

const Rx               = require('rx');
const Service          = require('./Service.js');
const Gateway          = require('./Gateway.js');
const mongoose         = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete   = require('mongoose-delete');

/**
 * 
 * 
 * @class Resource
 */
class Resource {
    /**
     * Creates an instance of Resource.
     * 
     * @param {String} name 
     * @param {Object} properties 
     * @param {Function} transformer 
     * 
     * @public
     * 
     * @memberof Resource
     */
    constructor(name, properties, transformer) {
        this.name        = name.charAt(0).toUpperCase() + name.slice(1);
        this.properties  = properties;
        this.transformer = transformer;
        
        /**
         * Define base schema
         * 
         */
        let schema = mongoose.Schema(
            properties,
            {
                timestamps: {
                    createdAt: 'createdAt',
                    updatedAt: 'updatedAt'
                },
                minimize: false
            }
        );
        
        schema.plugin(mongoosePaginate);
        schema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
        
        this.model = mongoose.model(name, schema);        
        
        /**
         * Init service
         * 
         */
        this.service = new Service(this);
    }

    /**
     * Get remote resource from another miscroservice
     * 
     * @param {Object} data
     * 
     * @public 
     * 
     * @returns {Object}
     * 
     * @memberof Resource
     */
    appendRemoteResource(data) {
        return Rx.Observable.if(
            //
            () => this._checkRemoteProperties(data),

            //
            this._getRemoteProperties(data)
                .flatMap(
                    key => {
                        const method = Array.isArray(data[key]) ? 'getRemoteResources' : 'getRemoteResource';

                        return Gateway[method](this.properties[key].endpoint, data[key]);
                    },
                    (key, resource) => {
                        data[key] = resource;

                        return data;
                    }
                )
                .distinct(),

            //
            Rx.Observable.of(data)
        );
    }

    /**
     * It filters the document's properties containing a joint with another mocroservice
     * 
     * @param {Object} data 
     * 
     * @private
     * 
     * @returns {Observable}
     * 
     * @memberof Resource
     */
    _getRemoteProperties(data) {
        return Rx.Observable.from(Object.keys(data))
            .filter(key => this.properties[key] && this.properties[key].endpoint !== undefined);
    }

    /**
    * Check if the model has a property linked with another microservice
    * 
    * @param {Object} data
    * 
    * @private
    * 
    * @returns {Boolean}
    * 
    * @memberof Resource
    */
    _checkRemoteProperties(data) {
        let value = false;

        Object.keys(this.properties).forEach(key => {
            if(this.properties[key].endpoint && data[key])
                value = true;
        });

        return value;
    }
}

module.exports = Resource;