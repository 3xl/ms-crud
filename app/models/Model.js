'use strict'

let Model = (name, fields) => {
    const mongoose = require('mongoose');

    /**
     * Define base schema
     * 
     */
    const schema = mongoose.Schema(fields, {
        timestamps: { 
            createdAt: 'createdAt',
            updatedAt: 'updatedAt' 
        },
        minimize: false
    });

    return mongoose.model(name, schema);
};

module.exports = Model;