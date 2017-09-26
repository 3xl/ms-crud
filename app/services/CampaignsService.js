'use strict';

const Rx             = require('rx');
const BaseService     = require('./BaseService.js');
const CampaignsRepository = require('../repositories/CampaignsRepository.js');

/**
 * 
 * 
 * @class CampaignsService
 */
class CampaignsService extends BaseService {

    /**
     * Creates an instance of CampaignsService.
     * 
     * @memberof CampaignsService
     */
    constructor() {
        super();
        
        this.repository = new CampaignsRepository();
    }
}

module.exports = CampaignsService;