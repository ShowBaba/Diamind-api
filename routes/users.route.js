/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-shadow */
const express = require('express');
const controller = require('../controllers/index');
const validateAuth = require('../middlewares/auth');

const router = express.Router();

router.route('/signup').post(validateAuth, controller.signup);

router.route('/signin').post(controller.signin);

router.route('/logout').get(controller.logout);
module.exports = router;
