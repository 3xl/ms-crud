// 'use strict';

// const { Ms } = require('../index.js');

// const itemTransformer = (item) => {
//     return {
//         _id: item._id,
//         campaign: item.campaign,
//         campaigns: item.campaigns,
//         total: item.campaigns.length
//     };
// }

// let ms = new Ms(
//     {
//         connection: 'mongodb://localhost:27017/ms-crud'
//     },
//     {
//         items: {
//             properties: {
//                 campaign: { type: String, endpoint: 'http://localhost:3000/campaigns/' },
//                 test: { type: String, endpoint: 'http://localhost:3000/campaigns/' },
//                 campaigns: { type: [String], endpoint: 'http://localhost:3000/campaigns/' }
//             },
//             transformer: itemTransformer
//         }
//     }
// )

// ms.start(3001);

const express = require('express')();

express.get('/healthcheck', (req, res, next) => {
    res.json({});
});

express.listen(3003, () => {
    console.log('Application started');
});