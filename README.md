Base crud microservice based on Express and Mongoose

### Usage

```js
'use strict';

const Ms = require('./index.js');

/**
 * Middlewares
 * 
 */
const resourceCustomPathMiddleware = (req, res, next) => {
    // do something

    next();
}

const resourceMiddleware = (req, res, next) => {
    // do something

    next();
}

const customPathMiddleware = (req, res, next) => {
    // do something

    next();
}

/**
 * Handlers
 * 
 */
const resourceCustomPathHandler = (req, res, next) => {
    // Append a source property, containig an observable, to req object.
    // It's possible to access to the resource object through req.resource
    req.source = req.resource.service.one(req.params.id)
        .map(resource => {});

    next();
}

const customPathHandler = (req, res, next) => {
    const resource = req.app.get('ms').getResource(resourceName);

    req.source = resource.service.all();

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

    // Middlewares
    [middleware]

    // Resources
    {
        resourceName: {
            properties: {
                propertyName: { type: String },
                propertyName: { type: String, endpoint: '{address}' }
            },
            middleware: resourceMiddleware,
            routes: [
                {
                    path: '/resourceCustomPath',
                    handler: resourceCustomPathHandler,
                    event: 'ResourceCustomeEventName',
                    method: 'GET',
                    middleware: resourceCustomPathMiddleware
                }
            ],
            transformer: resourceTransformer
        }
    },

    // Routes
    [
        {
            path: '/customPath',
            handler: customPathHandler,
            event: 'EventName',
            method: 'GET',
            middleware: customPathMiddleware
        }
    ]
);

ms.start(3000);

/**
 * Events
 * 
 */
ms.on('GetAll{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('GetOne{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('CreateOne{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('UpdateOne{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('RemoveOne{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('RestoreOne{resourceName}', (resource, data, emitter) => {
    console.log(data);
});

ms.on('ResourceCustomeEventName', (resource, data, emitter) => {
    console.log(data);
});

ms.on('EventName', (resource, data, emitter) => {
    console.log(data);
});

```