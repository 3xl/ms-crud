'use strict';

const { Ms, subscribe } = require('../index.js');

/**
 * Hanlders
 * 
 */
let statsHandler = (req, res, next) => {
    subscribe(
        // Observable
        req.resource.service.one(req.params.id)
            .map(campaign => campaign.title),
        
        res, req.app.get('ms'), 'StatsHandler'
    );
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
                itemId: { type: String, endpoint: 'http://localhost:3001/items/' }
            },
            routes: [
                {
                    path: '/:id/stats',
                    handler: statsHandler
                }
            ]
        }
    }
);

ms.start(3000);

ms.on('GetAllResources', (data) => {
    console.log('GetAllResources handler');
});