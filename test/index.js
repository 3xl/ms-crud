'use strict';

const Ms = require('../index.js');

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

    // Resources
    {
        campaigns: {
            properties: {
                title: { type: String },
                itemId: { type: String, endpoint: 'http://localhost:3001/items/' }
            },
            routes: [
                {
                    path: '/:id/stats',
                    handler: (req, res, next) => {
                        req.resource.service.one(req.params.id)
                            .map(campaign => campaign.title)
                            .subscribe(
                                title => res.json({ data: { title: title } }),
                                error => res.json({ data: null, error: error })
                            )                        
                    }
                }
            ]
        }
    }
);

ms.start(3000);

ms.on('GetAllResources', (data) => {
    console.log('GetAllResources handler');
});