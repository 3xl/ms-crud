'use strict';

const Controller = require('../controllers/Controller.js');
const router     = require('express').Router();

// GET /resources
router.get('/', Controller.all);

// GET /resources/:id
router.get('/:id', Controller.one);

// POST /resources
router.post('/', Controller.create);

// PUT /resources
router.put('/:id', Controller.update);

module.exports = router;
