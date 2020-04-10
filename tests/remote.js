'use strict';

const { Ms } = require('../index.js');

const itemTransformer = (item) => {
    return {
        _id: item._id,
        campaign: item.campaign,
        campaigns: item.campaigns,
        total: item.campaigns.length
    };
}

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
            },
            transformer: itemTransformer
        }
    }
)

ms.start(3001);

const express = require('express')();

express.get('/healthcheck', (req, res, next) => {
    res.json({});
});

express.listen(3003, () => {
    console.log('Application started');
});

// const Rx = require('rx');
// const { Gateway } = require('../index.js');

// Gateway.sendForm('http://www.calorie.it/search', {
//     strKeywords: 'Maionese',
//     suggest: 2,
//     x: 51,
//     y: 9
// })
// .do(response => console.log(response.error.response.body))
// // [ 'name', 'statusCode', 'message', 'error', 'options', 'response' ]
// // .do(response => console.log(Object.keys(response.error)))
// .flatMap(response => Rx.Observable.of(response.error))
// // .do(console.log)
// .subscribe(
//     // res => console.log(res),
//     // error => console.log(error),
//     // () => console.log('completed')
// )