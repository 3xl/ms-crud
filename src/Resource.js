'use strict';

const Service          = require('./Service.js');
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
     * 
     * @public
     * 
     * @memberof Resource
     */
    constructor(name, properties) {
        this.name       = name;
        this.properties = properties;
        
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
}

module.exports = Resource;