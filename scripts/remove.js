'use strict';

const fs = require("fs");

// Check if the value is a correct model name
if(process.argv[2] === undefined) {
    console.log('The model name must be a correct String');

    return;
}

// Adjust the model name capitalizing the first character
let modelName = process.argv[2].charAt(0).toUpperCase() + process.argv[2].slice(1);

// Remove the model file
let file = __dirname + "/../app/models/" + modelName + ".js";

if(fs.existsSync(file)) {
    fs.unlinkSync(__dirname + "/../app/models/" + modelName + ".js");
}