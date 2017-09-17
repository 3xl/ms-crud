'use strict';

const fs = require("fs");

// Check if the value is a correct model name
if(process.argv[2] === undefined) {
    console.log('The model name must be a correct String');

    return;
}

// Adjust the model name capitalizing the first character
let modelName = process.argv[2].charAt(0).toUpperCase() + process.argv[2].slice(1);
let file      = '';

/**
 * Model 
 * 
 */

 // Remove the model file
file = __dirname + "/../app/models/" + modelName + ".js";

if(fs.existsSync(file)) {
    fs.unlinkSync(__dirname + "/../app/models/" + modelName + ".js");
}

/**
 * Router
 * 
 */

 // Remove the model file
file = __dirname + "/../app/http/routers/" + modelName + ".js";

if(fs.existsSync(file)) {
    fs.unlinkSync(__dirname + "/../app/http/routers/" + modelName + ".js");
}