'use strict';

const { Ms, Gateway } = require('../index.js');
const Rx = require('rx');
const mongoose = require('mongoose');

const indexHandler = (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
}

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

const socketEventNameHandler = (data) => {
  return Rx.Observable.of(data)
    .do(console.log)
};


let ms = new Ms({
  // mongo
  mongo: {
    connection: 'mongodb://localhost:27017/ms-crud'
  },

  socket: {
    private: {
      events: [
        {
          name: 'SocketEventName',
          handler: socketEventNameHandler
        },
        {
          name: 'SocketEventName2',
          handler: socketEventNameHandler
        }
      ]
    }
  },

  // middlewares
  middlewares: [],

  // resources
  resources: {
    campaigns: {
      properties: {
        name: { type: String, unique: true },
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
        items: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
          quantity: { type: Number },
        }],
      },
      populate: [
        {
          path: 'items.item',
          select: 'name',
        },
        {
          path: 'item',
          select: 'name',
        },
      ],
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
      path: '/',
      handler: indexHandler
    },
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