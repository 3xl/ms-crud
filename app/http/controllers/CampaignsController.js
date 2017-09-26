'use strict';

const BaseController = require('./BaseController.js');
const Service        = require('../../services/CampaignsService.js');

const service = new Service(); 

/**
 * 
 * 
 * @class CampaignsController
 */
class CampaignsController extends BaseController {
    // add custom methods here

    /**
     * 
     * 
     * @static
     * @param {any} req
     * @param {any} res
     * 
     * @memberOf BaseController
     */
    // static methodName(req, res) {
    //     let source = service.methodName(req.model, req.query);

    //     BaseController.subscribe(source, res);
    // }
}

module.exports = CampaignsController;