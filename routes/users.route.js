/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-shadow */
const express = require('express');
const models = require('../models');
const {
  hashPassword, jwtToken, comparePassword
} = require('../utils');
const validateAuth = require('../middlewares/auth');
// const userController = require('../controllers/auth.controller');

const router = express.Router();
const { User } = models;
const { tokenBlacklist } = models;

// router.post('/signup', userController.signup);

router.route('/signup').post(validateAuth, (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = hashPassword(password);
    User.create({ email, password: hash }).then(
      (user_) => {
        const { id } = user_;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Registration Successful!',
          user: { id, email },
        });
      },
      (err) => next(err)
    );
  } catch (error) {
    next(error);
  }
});

router.route('/signin').post((req, res, next) => {
  try {
    const { email, password } = req.body;
    User.findOne({
      where: { email },
    })
      .then(
        (user) => {
          if (user && comparePassword(password, user.password)) {
            const token = jwtToken.createToken(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              message: 'Login Succesfully',
              token,
            });
          } else {
            res.statusCode = 400;
            res.send('Invalide Email/Password');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

router.route('/logout')
  .get((req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      tokenBlacklist.create({ token })
        .then(() => {
          res.json({
            status: 'success',
            message: 'User signed out',
          });
        });
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
