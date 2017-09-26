'use strict';

const fs = require("fs");

fs.readdir(__dirname + '/../app/models', (error, files) => {
    if(error) {
        console.log(error);
    } else {
        files.forEach(file => {
            if(file !== '.gitignore') {
                console.log('- ' + file.slice(0, -3));
            }
        });
    }
});