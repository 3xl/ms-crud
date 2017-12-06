'use strict';

const Ms = require('../index.js');

let ms = new Ms(
    {
        connection: 'mongodb://localhost:27017/ms-crud'
    },
    {
        items: {
            properties: {
                campaign: { type: String, endpoint: 'http://localhost:3000/campaigns/' },
                test: { type: String, endpoint: 'http://localhost:3000/campaigns/' },
                campaigns: { type: [String], endpoint: 'http://localhost:3000/campaigns/' }
            }
        }
    }
)

ms.start(3001);