'use strict';

const fs   = require("fs");
const tmpl = require("blueimp-tmpl");

// Check if the value is a correct model name
if(process.argv[2] === undefined) {
    console.log('The model name must be a correct String');

    return;
}

// Adjust the model name capitalizing the first character
let modelName = process.argv[2].charAt(0).toUpperCase() + process.argv[2].slice(1);

/**
 * Model
 * 
 */

// Override the template loading method:
tmpl.load = (moduleName) => {
    var filename = __dirname + "/templates/Model.tmpl";
    
    return fs.readFileSync(filename, "utf8");
};

// Save the model file
fs.writeFileSync(
    __dirname + "/../app/models/" + modelName + ".js", 
    tmpl("template-model", { modelName: modelName }),
    {
        flags: 'ax+'
    }
);

/**
 * Router
 * 
 */

// Override the template loading method:
tmpl.load = (moduleName) => {
    var filename = __dirname + "/templates/Router.tmpl";
    
    return fs.readFileSync(filename, "utf8");
};

// Save the model file
fs.writeFileSync(
    __dirname + "/../app/http/routers/" + modelName + ".js", 
    tmpl("template-router", {}),
    {
        flags: 'ax+'
    }
);