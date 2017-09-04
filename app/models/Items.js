'use strict';

const mongoose = require('mongoose');

/**
 * Define base schema
 * 
 */
let schema = mongoose.Schema(
    {
        // Put here custom properties
    }, 
    {
        timestamps: { 
            createdAt: 'createdAt',
            updatedAt: 'updatedAt' 
        },
        minimize: false
    }
);

module.exports = mongoose.model('Items', schema);