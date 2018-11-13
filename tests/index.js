'use strict';

const { Ms, Gateway } = require('../index.js');
const Rx = require('rx');

const resourceCustomPathMiddleware = (req, res, next) => {
  console.log('resourceCustomPathMiddleware');

  next();
}

const resourceMiddleware = (req, res, next) => {
  req.source = Rx.Observable.of({
    test: '123',
  });

  next();
}

const customPathMiddleware = (req, res, next) => {
  console.log('customPathMiddleware');

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
  req.source = req.resource.setTransformable(false, {})
    .flatMap(req.resource.service.one(req.params.id))
    .flatMap(objToPropagate => req.resource.setTransformable(true, objToPropagate));

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
        name: { type: String, unique: true }
      },
      transformer: campaignTransformer,
      // middlewares: [
      //   resourceMiddleware
      // ],
      routes: [
        {
          path: '/:id/customPath',
          handler: resourceCustomPathHandler,
          // middlewares: [
          //   resourceCustomPathMiddleware
          // ],
          event: 'ResourceEventName'
        },
        {
          path: '/findandupdate/:name',
          handler: findandupdatePathHandler
        }
      ]
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