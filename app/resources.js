'use strict';

const fs            = require('fs');
const path          = require('path');
const basename      = path.basename(module.filename);
const modelsFolder = __dirname + '/models';
const routesFolder = __dirname + '/http/routes';

var models = [];
var routes = [];

fs.readdirSync(modelsFolder)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        let modelModule = require(path.join(modelsFolder, file)),
            model = file.slice(0, -3).toLowerCase(),
            router = require(path.join(routesFolder, 'BaseRoutes.js')),
            route = '/' + file.slice(0, -3);

        models[model] = modelModule;
        routes.push([route, router]);
    });

module.exports = {
    models: models,
    routes: routes
};