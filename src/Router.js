'use strict';

const Controller = require('./Controller.js');
const router     = require('express').Router();

// GET /{resources}
router.get('/', [Controller.all, Controller.subscribe]);

// GET /{resources}/latest
router.get('/latest', [Controller.latest, Controller.subscribe]);

// GET /{resources}/:id
router.get('/:id', [Controller.one, Controller.subscribe]);

// POST /{resources}
router.post('/', [Controller.create, Controller.subscribe]);

// PUT /{resources}
router.put('/:id', [Controller.update, Controller.subscribe]);

// REMOVE /{resources}
router.delete('/:id', [Controller.remove, Controller.subscribe]);

// PATCH /{resources}
router.patch('/:id', [Controller.restore, Controller.subscribe]);

module.exports = router;
