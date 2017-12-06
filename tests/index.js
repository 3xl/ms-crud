'use strict';

const Ms = require('../index.js');

const campaignTransformer = (campaign) => {
    return {
        _id: campaign._id,
        name: campaign.name,
    };
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
            transformer: campaignTransformer
        }
    }
);

ms.start(3000);