'use strict';

const { Ms, Gateway } = require('../index.js');

const campaignTransformer = (campaign) => {
    return {
        _id: campaign._id,
        name: campaign.name,
    };
}

const resourceCustomPathHandler = (req, res, next) => {
    // Append a source property, containig an observable, to req object.
    // It's possible to access to the resource object through req.resource
    req.source = req.resource.service.one(req.params.id);

    next();
}

const customPathHandler = (req, res, next) => {
    const resource = req.app.get('ms').getResource('campaigns');

    req.source = resource.service.all();

    next();
}

let ms = new Ms(
    {
        connection: 'mongodb://localhost:27017/ms-crud'
    },
    {
        campaigns: {
            properties: {
                name: { type: String }
            },
            // transformer: campaignTransformer,
            routes: [
                {
                    path: '/:id/customPath',
                    handler: resourceCustomPathHandler,
                    event: 'ResourceEventName'
                }
            ]
        }        
    },
    [
        {
            path: '/customPath',
            handler: customPathHandler,
            event: 'CustomEventName'
        }
    ]
);

ms.start(3000);