'use strict'

const mongoose = require('mongoose');

let Model = (name = 'Resource', fields) => {
    
    /**
     * Define base schema
     * 
     */
    let schema = mongoose.Schema(fields, {
        timestamps: { 
            createdAt: 'createdAt',
            updatedAt: 'updatedAt' 
        },
        minimize: false
    });

    return mongoose.model(name, schema);
};

module.exports = Model;