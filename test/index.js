'use strict';

const Ms = require('../index.js');

/**
 * Hanlders
 * 
 */
let statsHandler = (req, res, next) => {
    req.source = req.resource.service.one(req.params.id)
        .map(campaign => campaign.title);

    next();
}

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
                // itemId: { type: String, endpoint: 'http://localhost:3001/items/' }
            },
            routes: [
                {
                    path: '/:id/stats',
                    handler: statsHandler,
                    event: 'Stats'
                }
            ]
        }
    }
);

ms.start(3000);

ms.on('GetAllCampaigns', data => {
    console.log('GetAllCampaigns');
});

ms.on('Stats', data => {
    console.log('Stats');
})