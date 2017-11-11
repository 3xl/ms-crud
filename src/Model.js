'use strict';

const mongoose         = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete   = require('mongoose-delete');

/**
 * 
 * 
 * @class Model
 */
class Model {
    /**
     * Creates an instance of Model.
     * 
     * @param {String} name 
     * @param {Object} properties 
     * 
     * @public
     * 
     * @memberof Model
     */
    constructor(name, properties) {
        this.name = name;
        
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
        
        this.mongooseModel = mongoose.model(name, schema);
    }
}

module.exports = Model;