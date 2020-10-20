/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/user.model');

const router = express.Router();
const authenticate = require('../authenticate');

const userRouter = express.Router();

router.use(bodyParser.json());

userRouter.route('/').get(authenticate.varifyAdmin, (req, res, next) => {
  User.find({})
    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          data: users,
        });
      },
      (err) => next(err),
    )
    .catch((err) => next(err));
});

userRouter.route('/signup').post((req, res) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err });
      } else {
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              status: 'Registration Successful!',
            });
          });
        });
      }
    },
  );
});

userRouter
  .route('/login')
  .post(passport.authenticate('local'), (req, res, next) => {
    // create a token
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token,
      status: 'Login Successful!',
    });
  });

userRouter.route('/logout').get((req, res, next) => {
  delete req.session;
  req.logOut();
  return res.redirect('/');
});

module.exports = userRouter;
