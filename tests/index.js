'use strict';

const Ms = require('../index.js');

let ms = new Ms(
    {
        connection: 'mongodb://localhost:27017/ms-crud'
    },
    {
        campaigns: {
            properties: {
                name: { type: String }
            }
        }
    }
);

ms.start(3000);