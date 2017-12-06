Base crud microservice based on Express and Mongoose

### Usage

```js
'use strict';

const Ms = require('./index.js');

/**
 * Handlers
 * 
 */
const customPathHandler = (req, res, next) => {
    // Append a source property, containig an observable, to req object.
    // It's possible to access to the resource object through req.resource
    req.source = req.resource.service.one(req.params.id)
        .map(resource => {});

    next();
}

/**
 * Transformers
 * 
 */
const resourceTransformer = (resource) => {
    return {
        // ...
    }
}

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

    // Resources
    {
        resourceName: {
            properties: {
                propertyName: { type: String },
                propertyName: { type: String, endpoint: '{address}' }
            },
            routes: [
                {
                    path: '/customPath',
                    handler: customPathHandler,
                    event: 'EventName'
                }
            ],
            transformer: resourceTransformer
        }
    }
);

ms.start(3000);

/**
 * Events
 * 
 */
ms.on('GetAllResources', data => {
    console.log(data);
});

ms.on('GetOneResource', data => {
    console.log(data);
});

ms.on('CreateOneResource', data => {
    console.log(data);
});

ms.on('UpdateOneResource', data => {
    console.log(data);
});

ms.on('RemoveOneResources', data => {
    console.log(data);
});

ms.on('RestoreOneResources', data => {
    console.log(data);
});

ms.on('EventName', data => {
    console.log(data);
});

```