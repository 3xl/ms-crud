'use strict';

const fs        = require('fs');
const path      = require('path');
const basename  = path.basename(module.filename);
const dirname   = __dirname + '/routes';

var routes = [];

fs.readdirSync(dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        var router = require(path.join(dirname, file)),
            route = '/' + file.slice(0, -3);

        routes.push([route, router]);
    });

module.exports = routes;