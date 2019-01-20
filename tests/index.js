'use strict';

const { Ms, Gateway } = require('../index.js');
const Rx = require('rx');
const mongoose = require('mongoose');

const resourceCustomPathMiddleware = (req, res, next) => {
  req.source = req.source
    .flatMap(Rx.Observable.of({ x: 1 }))
    .do(console.log)

  next();
}

const resourceMiddleware2 = (req, res, next) => {
  req.source = req.source
    .flatMap(Rx.Observable.of({ x: 2 }))
    .do(console.log)

  next();
}

const resourceMiddleware = (req, res, next) => {
  req.source = req.source
    .flatMap(Rx.Observable.of({ x: 1 }))
    .do(console.log)

  next();
}

const customPathMiddleware = (req, res, next) => {
  req.source = req.source
    .flatMap(Rx.Observable.of({ x: 1 }))
    .do(console.log)

  next();
}

const campaignTransformer = (campaign) => {
  return {
    _id: campaign._id,
    name: campaign.name,
  };
}

const resourceCustomPathHandler = (req, res, next) => {
  // Append a source property, containig an observable, to req object.
  // It's possible to access to the resource object through req.resource
  req.source = req.source
    .flatMap(req.resource.service.one(req.params.id))

  next();
}

const customPathHandler = (req, res, next) => {
  const resource = req.app.get('ms').getResource('campaigns');

  req.source = resource.setTransformable(true).service.all();

  next();
}

const findandupdatePathHandler = (req, res, next) => {
  const resource = req.app.get('ms').getResource('campaigns');

  req.source = resource.service.findAndUpdate(
    {
      name: req.params.name
    },
    {
      name: 'modified name 2'
    }
  );

  next();
}



let ms = new Ms({
  // mongo
  mongo: {
    connection: 'mongodb://localhost:27017/ms-crud'
  },

  // middlewares
  middlewares: [],

  // resources
  resources: {
    campaigns: {
      properties: {
        name: { type: String, unique: true },
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', populate: { active: true, select: 'name' } },
      },
      // transformer: campaignTransformer,
      middlewares: [
        resourceMiddleware,
        resourceMiddleware2,
      ],
      routes: [
        {
          path: '/:id/customPath',
          handler: resourceCustomPathHandler,
          middlewares: [
            resourceCustomPathMiddleware,
            resourceCustomPathMiddleware,
          ],
          event: 'ResourceEventName'
        },
        {
          path: '/findandupdate/:name',
          handler: findandupdatePathHandler
        }
      ]
    },
    items: {
      properties: {
        name: { type: String }
      }
    }
  },

  // custom routes
  routes: [
    {
      path: '/customPath',
      handler: customPathHandler,
      event: 'CustomEventName',
      // middlewares: [
      //   customPathMiddleware
      // ]
    }
  ]
});

ms.start(3000);