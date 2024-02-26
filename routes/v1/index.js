'use strict';

const router = require('express').Router();
const v1 = require('./v1');
router.use('/v2', v1);

module.exports = router;