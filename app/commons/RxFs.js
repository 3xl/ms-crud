'use strict';

const Rx = require('Rx');
const fs = require('fs');

/**
 * Utility class that converts some fs methods in Rx
 * 
 * @class RxFs
 */
class RxFs {
    
    /**
     * Read the content of a directory
     * 
     * @static
     * @param {any} path 
     * @returns 
     * 
     * @memberOf RxFs
     */
    static readdir(path) {
        let obs = Rx.Observable.fromNodeCallback(fs.readdir);

        return obs(path);
    }
    
    /**
     * Rename a file
     * 
     * @static
     * @param {any} oldPath 
     * @param {any} newPath 
     * @returns 
     * 
     * @memberOf RxFs
     */
    static rename(oldPath, newPath) {
        let obs =  Rx.Observable.fromNodeCallback(fs.rename);

        return obs(oldPath, newPath);
    }
}

module.exports = RxFs;