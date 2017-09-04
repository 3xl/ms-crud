'use strict';

const BaseController = require('../controllers/BaseController.js');
const router         = require('express').Router();

// GET /{resources}
router.get('/', BaseController.all);

// GET /{resources}/:id
router.get('/:id', BaseController.one);

// POST /{resources}
router.post('/', BaseController.create);

// PUT /{resources}
router.put('/:id', BaseController.update);

// REMOVE /{resources}
router.delete('/:id', BaseController.remove);

module.exports = router;
