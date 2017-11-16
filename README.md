Base crud microservice based on Express and Mongoose

### Usage

```js
'use strict';

const {Ms, subscribe} = require('./index.js');

/**
 * Init application
 * 
 */
let ms = new Ms(
    // Mongo configuration
    {
        user: "",
        password: "",
        connection: "mongodb://{address}t:{port}/{database}"
    },

    // Models
    {
        modelName: {
            properties: {
                propertyName: { type: String },
                propertyName: { type: String, endpoint: '{address}' }
            },
            routes: [
                {
                    path: '/customPath',
                    handler: customPathHandler
                }
            ]
        }
    }
);

ms.start(3000);

// Events 
ms.on('GetAllResources', (data) => {
    console.log(data);
});

ms.on('GetOneResource', (data) => {
    console.log(data);
});

ms.on('CreateOneResource', (data) => {
    console.log(data);
});

ms.on('UpdateOneResource', (data) => {
    console.log(data);
});

ms.on('RemoveAllResources', (data) => {
    console.log(data);
});

```