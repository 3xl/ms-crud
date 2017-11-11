'use strict';

const Ms = require('./index.js');

/**
 * Init application
 * 
 */
let ms = new Ms(
    // Mongo configuration
    {
        user: "root",
        password: "",
        connection: "mongodb://localhost:27017/ms_crud"
    },

    // Models
    {
        items: {},
        campaigns: {
            title: { type: String },
            itemId: { type: String, endpoint: 'http://localhost:3001/items/' }
        }
    }
);

ms.start(3000);

ms.on('GetAllResources', (data) => {
    console.log(data);
})