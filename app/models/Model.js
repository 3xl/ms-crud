'use strict'

module.exports = (name, fields) => {
    const mongoose = require('mongoose');

    /**
     * Define model schema
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