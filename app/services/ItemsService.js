'use strict';

const Rx             = require('rx');
const BaseService     = require('./BaseService.js');
const ItemsRepository = require('../repositories/ItemsRepository.js');

/**
 * 
 * 
 * @class ItemsService
 */
class ItemsService extends BaseService {

    /**
     * Creates an instance of ItemsService.
     * 
     * @memberof ItemsService
     */
    constructor() {
        super();
        
        this.repository = new ItemsRepository();
    }
}

module.exports = ItemsService;